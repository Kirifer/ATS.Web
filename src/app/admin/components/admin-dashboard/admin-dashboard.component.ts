// import { Component} from '@angular/core';

// @Component({
//   selector: 'app-admin-dashboard',
//   templateUrl: './admin-dashboard.component.html',
//   styleUrls: ['./admin-dashboard.component.css']
// })
// export class AdminDashboardComponent{

// }

import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApplicationStatus, JobCandidate } from '../../../models/job-candidate';
import { JobRoles } from '../../../models/job-roles';
import { catchError, map, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import * as echarts from 'echarts';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import {
  ApplicationStatusDisplay,
  SourcingToolDisplay,
  HRInChargeDisplay,
} from '../../../models/job-candidate';
import {
  HiringManagerDisplay,
  HiringTypeDisplay,
  JobLocationDisplay,
  JobStatusDisplay,
  RoleLevelDisplay,
  ShiftScheduleDisplay,
} from '../../../models/job-roles';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
})
export class AdminDashboardComponent implements OnInit {
  @ViewChild('sourcingToolChart') sourcingToolChartElement!: ElementRef;
  @ViewChild('hrChart') hrChartElement!: ElementRef;
  @ViewChild('applicantFunnelChart') applicantFunnelChartElement!: ElementRef;
  @ViewChild('candidatesChart') candidatesChart!: ElementRef;
  @ViewChild('jobOffersChart') jobOffersChartElement!: ElementRef;
  @ViewChild('newCandidatesChart') newCandidatesChartElement!: ElementRef;
  @ViewChild('interviewChart') forInterviewChartElement!: ElementRef;
  @ViewChild('newHiresChart') newHiresChartElement!: ElementRef;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  jobcandidates: JobCandidate[] = [];
  jobroles: JobRoles[] = [];
  sourcingToolAnalytics: { [key: string]: number } = {};
  fillRatePercentage: number = 0;
  applicationStatusCount: { [key: string]: number } = {};
  candidatesSourcedByHr: { [key: string]: number } = {};
  candidatesPerPosition: { [key: string]: number } = {};
  activeJobsCount: number = 0;
  newCandidatesCount: number = 0;
  forInterviewCandidatesCount: number = 0;
  jobOffers: { made: number; accepted: number; declined: number } = {
    made: 0,
    accepted: 0,
    declined: 0,
  };
  newHiresCount: number = 0;
  avgTimeToFill: { jobName: string; timeToFill: number | undefined }[] = [];
  agingCandidates: { jobName: string; aging: string | undefined }[] = [];

  displayedColumns: string[] = ['jobName', 'timeToFill', 'aging'];
  dataSource = new MatTableDataSource<any>([]); // Initialize dataSource as MatTableDataSource

  timePeriods = [
    { value: 'last7days', label: 'Last 7 Days' },
    { value: 'last14days', label: 'Last 14 Days' },
    { value: 'last30days', label: 'Last 30 Days' },
    { value: 'last60days', label: 'Last 60 Days' },
    { value: 'last90days', label: 'Last 90 Days' },
    { value: 'last6months', label: 'Last 6 Months' },
    { value: 'last1year', label: 'Last 1 Year' },
  ];

  selectedPeriod: string = 'last7days';
  startDate: Date | null = null;
  endDate: Date | null = null;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.setDefaultDateRange(); // Set default date range for last 7 days
    this.fetchCandidates();
    this.fetchJobRoles();
  }

  setDefaultDateRange() {
    const now = new Date();
    this.endDate = new Date(now); // End date is always the current date
    this.startDate = new Date(now.setDate(now.getDate() - 7)); // Start date is 7 days ago
    this.selectedPeriod = 'last7days'; // Set the default period
  }

  ngAfterViewInit() {
    this.renderSourcingToolChart();
    this.renderSourcingHRChart();
    this.renderApplicantFunnelChart();
    this.renderCandidatesPerPositionChart();
    this.renderJobOffersChart();
    this.renderNewCandidatesChart();
    this.renderForInterviewCandidatesChart();
    this.renderNewHiresLineChart();

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  fetchCandidates() {
    this.http
      .get<{ data: JobCandidate[]; code: number; succeeded: boolean }>(
        'https://localhost:7012/jobcandidate'
      )
      .pipe(
        map((response) => response.data),
        tap((data) => {
          // console.log('Data received from backend:', data);
          this.jobcandidates = this.filterCandidates(data);
          this.sourcingToolAnalytics = this.getSourcingToolAnalytics();
          this.applicationStatusCount = this.getApplicationStatusCount();
          this.candidatesSourcedByHr = this.getCandidatesSourcedByHr();
          this.candidatesPerPosition = this.getCandidatesPerPosition();
          this.newCandidatesCount = this.getNewCandidates();
          this.forInterviewCandidatesCount = this.getForInterviewCandidates();
          this.jobOffers = this.getJobOffers();
          this.newHiresCount = this.getNewHires();

          this.renderSourcingToolChart();
          this.renderSourcingHRChart();
          this.renderApplicantFunnelChart();
          this.renderCandidatesPerPositionChart();
          this.renderNewCandidatesChart();
          this.renderNewHiresLineChart();
          this.renderJobOffersChart();
          this.renderForInterviewCandidatesChart();
        }),
        catchError((error) => {
          console.error('Error fetching candidates:', error);
          return throwError(error);
        })
      )
      .subscribe(() => this.combineData()); // Call combineData here
  }

  fetchJobRoles() {
    this.http
      .get<{ data: JobRoles[]; code: number; succeeded: boolean }>(
        'https://localhost:7012/jobrole'
      )
      .pipe(
        map((response) => response.data),
        tap((data) => {
          // console.log('Data received from backend:', data);
          this.jobroles = this.filterJobRoles(data);
          this.fillRatePercentage = this.getFillRate();
          this.activeJobsCount = this.getActiveJobsCount();
          this.avgTimeToFill = this.getTimeToFill();
          this.agingCandidates = this.getAgingCandidates();
        }),
        catchError((error) => {
          console.error('Error fetching job roles:', error);
          return throwError(error);
        })
      )
      .subscribe(() => this.combineData()); // Call combineData here
  }

  filterCandidates(candidates: JobCandidate[]): JobCandidate[] {
    let filtered = candidates;

    if (this.startDate && this.endDate) {
      filtered = filtered.filter((candidate) => {
        const appliedDate = new Date(candidate.dateApplied);
        return appliedDate >= this.startDate! && appliedDate <= this.endDate!;
      });
    }

    return filtered;
  }

  filterJobRoles(roles: JobRoles[]): JobRoles[] {
    let filtered = roles;

    if (this.startDate && this.endDate) {
      filtered = filtered.filter((role) => {
        const openDate = role.openDate ? new Date(role.openDate) : null;
        return (
          openDate !== null &&
          openDate >= this.startDate! &&
          openDate <= this.endDate!
        );
      });
    }

    return filtered;
  }

  // Modify onPeriodChange to use the selected period
  onPeriodChange() {
    const now = new Date();

    if (this.selectedPeriod === 'last7days') {
      this.startDate = new Date(now.setDate(now.getDate() - 7));
    } else if (this.selectedPeriod === 'last14days') {
      this.startDate = new Date(now.setDate(now.getDate() - 14));
    } else if (this.selectedPeriod === 'last30days') {
      this.startDate = new Date(now.setDate(now.getDate() - 30));
    } else if (this.selectedPeriod === 'last60days') {
      this.startDate = new Date(now.setDate(now.getDate() - 60));
    } else if (this.selectedPeriod === 'last90days') {
      this.startDate = new Date(now.setDate(now.getDate() - 90));
    } else if (this.selectedPeriod === 'last6months') {
      this.startDate = new Date(now.setMonth(now.getMonth() - 6));
    } else if (this.selectedPeriod === 'last1year') {
      this.startDate = new Date(now.setFullYear(now.getFullYear() - 1));
    }

    this.endDate = new Date(); // End date is always the current date
    this.fetchCandidates(); // Refresh data with new date range
    this.fetchJobRoles();
  }

  combineData() {
    const agingCandidates = this.getAgingCandidates();
    const timeToFillData = this.getTimeToFill();

    const jobMap = new Map<string, any>();

    agingCandidates.forEach((candidate) => {
      jobMap.set(candidate.jobName, { ...candidate });
    });

    timeToFillData.forEach((data) => {
      if (jobMap.has(data.jobName)) {
        jobMap.get(data.jobName).timeToFill = data.timeToFill;
      } else {
        jobMap.set(data.jobName, {
          jobName: data.jobName,
          timeToFill: data.timeToFill,
        });
      }
    });

    this.dataSource.data = Array.from(jobMap.values());
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // REPORTS SECTION

  // 1. Sourcing Tools Analytics
  getSourcingToolAnalytics() {
    const toolCounts: { [key: string]: number } = {};
    this.jobcandidates.forEach((candidate) => {
      const tool = candidate.sourceTool;
      const displayTool = SourcingToolDisplay[tool];
      toolCounts[displayTool] = (toolCounts[displayTool] || 0) + 1;
    });
    return toolCounts;
  }

  // 2. Fill Rate
  getFillRate(): number {
    const totalJobs = this.jobroles.length;
    const filledJobs = this.jobroles.filter(
      (job) => job.jobStatus === 'FilledPosition'
    ).length;
    return totalJobs > 0 ? (filledJobs / totalJobs) * 100 : 0;
  }

  // 3. Applicant Funnel (Application Status)
  getApplicationStatusCount() {
    const statusCounts: { [key: string]: number } = {};

    // Initialize statusCounts with all possible statuses. This is for showing all the statuses including those with 0 values.
    // Object.values(ApplicationStatusDisplay).forEach(displayStatus => {
    //   statusCounts[displayStatus] = 0;
    // });

    this.jobcandidates.forEach((candidate) => {
      const status = candidate.applicationStatus;
      const displayStatus = ApplicationStatusDisplay[status];
      statusCounts[displayStatus] = (statusCounts[displayStatus] || 0) + 1;
    });

    return statusCounts;
  }

  // 4. Sourced by Recruiter
  getCandidatesSourcedByHr() {
    const hrCounts: { [key: string]: number } = {};
    this.jobcandidates.forEach((candidate) => {
      const hr = candidate.assignedHr;
      const displayHr = HRInChargeDisplay[hr];
      hrCounts[displayHr] = (hrCounts[displayHr] || 0) + 1;
    });
    return hrCounts;
  }

  // 5. Total Number of Candidates per Position
  getCandidatesPerPosition() {
    const positionCounts: { [key: string]: number } = {};
    this.jobcandidates.forEach((candidate) => {
      const position = candidate.jobName;
      positionCounts[position] = (positionCounts[position] || 0) + 1;
    });
    return positionCounts;
  }

  // 6. Active Jobs
  getActiveJobsCount() {
    return this.jobroles.filter((role) =>
      ['FilledPosition', 'Cancelled', 'OnHold'].includes(role.jobStatus)
    ).length;
  }

  // 7. Qualified
  getQualifiedCandidates(): number {
    return this.jobcandidates.filter((candidate) =>
      [
        ApplicationStatus.TechnicalInterview,
        ApplicationStatus.ClientInterview,
        ApplicationStatus.JobOffer,
        ApplicationStatus.ContractPreparation,
      ].includes(candidate.applicationStatus)
    ).length;
  }

  //8. Interviewed Candidates
  getInterviewedCandidates(): number {
    return this.jobcandidates.filter(
      (candidate) =>
        candidate.applicationStatus === ApplicationStatus.ClientInterview
    ).length;
  }

  // PROGRESS SECTION

  // 1. New Candidates (should be dynamic)
  getNewCandidates(): number {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return this.jobcandidates.filter(
      (candidate) => new Date(candidate.dateApplied) >= sevenDaysAgo
    ).length;
  }

  // 2. For Interview Candidates
  getForInterviewCandidates(): number {
    return this.jobcandidates.filter((candidate) =>
      ['InitialInterview', 'TechnicalInterview', 'ClientInterview'].includes(
        candidate.applicationStatus
      )
    ).length;
  }

  // 3. Job Offer (Made, Accepted, Declined)
  getJobOffers() {
    const jobOffers = {
      made: 0,
      accepted: 0,
      declined: 0,
    };

    this.jobcandidates.forEach((candidate) => {
      if (candidate.applicationStatus === 'JobOffer') {
        jobOffers.made++;
      } else if (candidate.applicationStatus === 'ContractPreparation') {
        jobOffers.accepted++;
      } else if (candidate.applicationStatus === 'RetractedApplication') {
        jobOffers.declined++;
      }
    });

    return jobOffers;
  }

  // 4. New Hires
  getNewHires(): number {
    return this.jobcandidates.filter(
      (candidate) =>
        candidate.applicationStatus === ApplicationStatusDisplay.Onboarded
    ).length;
  }

  // 5. Time to Fill (Job Roles)
  // getTimeToFill(): string[] {
  //   return this.jobroles
  //     .filter(job => job.closedDate && job.openDate)
  //     .map(job => {
  //       const daysToFill = job.closedDate && job.openDate ? (new Date(job.closedDate).getTime() - new Date(job.openDate).getTime()) / (1000 * 60 * 60 * 24) : 0;
  //       return `${job.jobName}: ${daysToFill} days`;
  //     });
  // }

  getTimeToFill() {
    return this.jobroles
      .filter((job) => job.closedDate && job.openDate) // Ensure both dates are present
      .map((job) => {
        const closedDate = job.closedDate ? new Date(job.closedDate) : null;
        const openDate = job.openDate ? new Date(job.openDate) : null;

        if (closedDate && openDate) {
          const timeToFill =
            (closedDate.getTime() - openDate.getTime()) / (1000 * 60 * 60 * 24);
          return {
            jobName: job.jobName,
            timeToFill: timeToFill,
          };
        } else {
          return {
            jobName: job.jobName,
            timeToFill: undefined, // or 0 or any default value you prefer
          };
        }
      });
  }

  // 6. Interview Planner
  getInterviewPlanner() {
    return this.jobcandidates.filter(
      (candidate) =>
        candidate.initialInterviewSchedule ||
        candidate.technicalInterviewSchedule ||
        candidate.clientFinalInterviewSchedule
    );
  }

  // 7. Aging
  getAgingCandidates() {
    const currentDate = new Date();
    return this.jobroles.map((role) => {
      let postedDate: Date;
      // Check if openDate is defined and valid
      if (role.openDate) {
        postedDate = new Date(role.openDate);
        // Validate the date
        if (isNaN(postedDate.getTime())) {
          postedDate = new Date(0); // Fallback to a default date if invalid
        }
      } else {
        postedDate = new Date(0); // Fallback to a default date if openDate is undefined
      }
      // Calculate the number of days since the postedDate
      const timeDiff = currentDate.getTime() - postedDate.getTime();
      const daysAging = Math.floor(timeDiff / (1000 * 3600 * 24)); // Convert milliseconds to days
      return {
        jobName: role.jobName,
        aging: daysAging.toString(), // Convert number to string
      };
    });
  }

  //Charts
  renderSourcingToolChart() {
    if (!this.sourcingToolChartElement) {
      return;
    }

    const chartElement = this.sourcingToolChartElement.nativeElement;
    let chart = echarts.getInstanceByDom(chartElement);

    if (chart) {
      chart.dispose();
    }

    chart = echarts.init(chartElement, null, {
      devicePixelRatio: window.devicePixelRatio,
    });

    const filteredData = this.getSourcingToolAnalytics(); // Ensure this returns data based on the filtered candidates

    const chartOptions = {
      title: {
        text: 'Sourcing Tool Analytics',
        left: 'center',
        top: 'top',
      },
      tooltip: {
        trigger: 'item',
      },
      legend: {
        top: 'bottom',
        left: 'center',
        icon: 'circle',
        textStyle: {
          lineHeight: 10,
        },
        itemHeight: 15,
        itemGap: 8,
        align: 'auto',
      },
      color: [
        '#003f5c',
        '#2f4b7c',
        '#665191',
        '#a05195',
        '#d45087',
        '#f76c6c',
        '#f95d6a',
        '#ff7c43',
        '#ffa600',
      ],
      series: [
        {
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['50%', '60%'],
          startAngle: 180,
          endAngle: 360,
          data: Object.entries(filteredData).map(([name, value]) => ({
            value,
            name,
          })),
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
          label: {
            show: true,
          },
          labelLine: {
            show: true,
          },
        },
      ],
    };

    chart.setOption(chartOptions);
    window.addEventListener('resize', () => {
      chart.resize();
    });
  }

  renderSourcingHRChart() {
    if (!this.hrChartElement) {
      return;
    }

    const chartElement = this.hrChartElement.nativeElement;
    let chart = echarts.getInstanceByDom(chartElement);

    if (chart) {
      chart.dispose();
    }

    chart = echarts.init(chartElement, null, {
      devicePixelRatio: window.devicePixelRatio,
    });

    const filteredHRData = this.getCandidatesSourcedByHr(); // Ensure this returns filtered data

    const hrNames = Object.keys(filteredHRData);
    const hrCounts = Object.values(filteredHRData);

    const sortedHrData = hrNames
      .map((name, index) => ({
        name,
        count: hrCounts[index],
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    const sortedHrNames = sortedHrData.map((data) => data.name);
    const sortedHrCounts = sortedHrData.map((data) => data.count);

    const chartOptions = {
      title: {
        text: 'Sourced by Recruiter',
        left: 'center',
        top: 'top',
      },
      tooltip: {
        trigger: 'item',
        axisPointer: {
          type: 'shadow',
        },
      },
      xAxis: {
        type: 'category',
        data: sortedHrNames,
        axisLabel: {
          rotate: 45,
        },
        axisTick: {
          alignWithLabel: true,
        },
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: sortedHrCounts.map((value, index) => ({
            value,
            itemStyle: {
              color: ['#003f5c', '#7a5195', '#ef5675', '#ffa600'][index % 4],
            },
          })),
          type: 'bar',
          barWidth: '50%',
          showBackground: true,
          backgroundStyle: {
            color: 'rgba(180, 180, 180, 0.2)',
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    };

    chart.setOption(chartOptions);
    window.addEventListener('resize', () => {
      chart.resize();
    });
  }

  renderApplicantFunnelChart() {
    if (!this.applicantFunnelChartElement) {
      return;
    }

    const chartElement = this.applicantFunnelChartElement.nativeElement;
    let chart = echarts.getInstanceByDom(chartElement);

    if (chart) {
      chart.dispose();
    }

    chart = echarts.init(chartElement, null, {
      devicePixelRatio: window.devicePixelRatio,
    });

    const filteredFunnelData = this.getApplicationStatusCount(); // Ensure this returns filtered data

    const sortedFunnelData = Object.entries(filteredFunnelData)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    const funnelData = sortedFunnelData.map((item, index) => ({
      value: item.value,
      name: item.name,
      itemStyle: {
        color: [
          '#003f5c',
          '#4a6582',
          '#2f4b7c',
          '#5d3a7d',
          '#665191',
          '#7d3f8f',
          '#a05195',
          '#c74b8e',
          '#d45087',
          '#f76c6c',
          '#f95d6a',
          '#ff7c43',
          '#ffa600',
        ][index % 13],
      },
    }));

    const chartOptions = {
      title: {
        text: 'Applicant Funnel',
        left: 'center',
        top: 'top',
      },
      tooltip: {
        trigger: 'item',
      },
      series: [
        {
          type: 'funnel',
          top: 50,
          bottom: 20,
          width: '60%',
          min: 0,
          max: Math.max(...Object.values(filteredFunnelData)),
          minSize: '20%',
          maxSize: '80%',
          sort: 'descending',
          gap: 2,
          label: {
            show: true,
            color: '#000',
          },
          labelLine: {
            length: 15,
            lineStyle: {
              width: 1,
              type: 'solid',
            },
          },
          emphasis: {
            label: {
              fontSize: 15,
            },
          },
          data: funnelData,
        },
      ],
    };

    chart.setOption(chartOptions);
    window.addEventListener('resize', () => {
      chart.resize();
    });
  }

  renderCandidatesPerPositionChart() {
    const filteredPositionCounts = this.getCandidatesPerPosition(); // Ensure this returns filtered data
    const positions = Object.keys(filteredPositionCounts);
    const counts = Object.values(filteredPositionCounts);

    if (!this.candidatesChart.nativeElement) {
      return;
    }

    const chartElement = this.candidatesChart.nativeElement;
    let chart = echarts.getInstanceByDom(chartElement);

    if (chart) {
      chart.dispose();
    }

    chart = echarts.init(chartElement, null, {
      devicePixelRatio: window.devicePixelRatio,
    });

    const chartOptions = {
      title: {
        text: 'Total Candidates per Position',
        left: 'center',
        top: 'top',
      },
      tooltip: {
        trigger: 'item',
        axisPointer: {
          type: 'shadow',
        },
      },
      xAxis: {
        type: 'category',
        data: positions,
        axisLabel: {
          rotate: 45,
          formatter: (value: string) =>
            value.length > 10 ? value.substring(0, 10) + '...' : value,
        },
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: counts.map((value, index) => ({
            value,
            itemStyle: {
              color: [
                '#003f5c',
                '#4a6582',
                '#2f4b7c',
                '#5d3a7d',
                '#665191',
                '#7d3f8f',
                '#a05195',
                '#c74b8e',
                '#d45087',
                '#f76c6c',
                '#f95d6a',
                '#ff7c43',
                '#ffa600',
              ][index % 13],
            },
          })),
          type: 'bar',
          barWidth: '50%',
          showBackground: true,
          backgroundStyle: {
            color: 'rgba(180, 180, 180, 0.2)',
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    };

    chart.setOption(chartOptions);
    window.addEventListener('resize', () => {
      chart.resize();
    });
  }

  renderNewCandidatesChart() {
    if (!this.newCandidatesChartElement) {
      return;
    }

    const chartElement = this.newCandidatesChartElement.nativeElement;
    let chart = echarts.getInstanceByDom(chartElement);

    if (chart) {
      chart.dispose();
    }

    chart = echarts.init(chartElement, null, {
      devicePixelRatio: window.devicePixelRatio,
    });

    const days = [];
    const candidatesCount = [];
    const startDate = this.startDate || new Date();
    const endDate = this.endDate || new Date();
    const today = new Date(endDate);
    today.setHours(0, 0, 0, 0);

    if (startDate && endDate) {
      // Ensure startDate is at the start of the day
      startDate.setHours(0, 0, 0, 0);

      // Populate days and counts
      for (
        let i = 0;
        i <=
        Math.floor(
          (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        i++
      ) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        const day = date.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        });
        days.push(day);

        const count = this.jobcandidates.filter((candidate) => {
          const candidateDate = new Date(candidate.dateApplied);
          candidateDate.setHours(0, 0, 0, 0);
          return candidateDate.getTime() === date.getTime();
        }).length;

        candidatesCount.push(count);
      }
    }

    console.log('Days:', days); // Debug output
    console.log('Candidates Count:', candidatesCount); // Debug output

    const chartOptions = {
      title: {
        text: `New Candidates from ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}`,
        left: 'center',
        top: 'top',
      },
      tooltip: {
        trigger: 'axis',
      },
      xAxis: {
        type: 'category',
        data: days,
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: candidatesCount,
          type: 'line',
          smooth: true,
          itemStyle: {
            color: '#003f5c',
          },
          lineStyle: {
            color: '#003f5c',
          },
        },
      ],
    };

    chart.setOption(chartOptions);

    window.addEventListener('resize', () => {
      chart.resize();
    });
  }

  renderForInterviewCandidatesChart() {
    if (!this.forInterviewChartElement) {
      return;
    }

    const chartElement = this.forInterviewChartElement.nativeElement;
    let chart = echarts.getInstanceByDom(chartElement);

    if (chart) {
      chart.dispose();
    }

    chart = echarts.init(chartElement, null, {
      devicePixelRatio: window.devicePixelRatio,
    });

    // Define the interview stages and count candidates at each stage
    const interviewStages = [
      'InitialInterview',
      'TechnicalInterview',
      'ClientInterview',
    ];
    const stageCounts = interviewStages.map(
      (stage) =>
        this.jobcandidates.filter(
          (candidate) => candidate.applicationStatus === stage
        ).length
    );

    const chartOptions = {
      title: {
        text: 'Candidates in Interview Stages',
        left: 'center',
        top: 'top',
      },
      tooltip: {
        trigger: 'item',
        axisPointer: {
          type: 'shadow',
        },
      },
      xAxis: {
        type: 'value',
        name: 'Number of Candidates',
        nameLocation: 'end',
        nameGap: 20,
      },
      yAxis: {
        type: 'category',
        data: ['Initial Interview', 'Technical Interview', 'Client Interview'],
        axisLabel: {
          formatter: (value: string) => value, // Label format
        },
      },
      series: [
        {
          data: stageCounts.map((value, index) => ({
            value,
            itemStyle: {
              color: ['#003f5c', '#7a5195', '#ef5675'][index % 3], // Custom colors for each stage
            },
          })),
          type: 'bar',
          barWidth: '50%',
          label: {
            show: true,
            position: 'right',
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    };

    chart.setOption(chartOptions);

    // Re-center the chart on window resize
    window.addEventListener('resize', () => {
      chart.resize();
    });
  }

  renderNewHiresLineChart() {
    if (!this.newHiresChartElement) {
      return;
    }

    const chartElement = this.newHiresChartElement.nativeElement;
    let chart = echarts.getInstanceByDom(chartElement);

    if (chart) {
      chart.dispose();
    }

    chart = echarts.init(chartElement, null, {
      devicePixelRatio: window.devicePixelRatio,
    });

    const days = [];
    const hiresCount = [];
    const startDate = this.startDate || new Date();
    const endDate = this.endDate || new Date();
    const today = new Date(endDate);
    today.setHours(0, 0, 0, 0);

    if (startDate && endDate) {
      // Ensure startDate is at the start of the day
      startDate.setHours(0, 0, 0, 0);

      // Populate days and counts
      for (
        let i = 0;
        i <=
        Math.floor(
          (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        i++
      ) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        const day = date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        });
        days.push(day);

        const count = this.jobcandidates.filter((candidate) => {
          const candidateDate = new Date(candidate.dateApplied);
          candidateDate.setHours(0, 0, 0, 0);
          return (
            candidateDate.getTime() === date.getTime() &&
            candidate.applicationStatus === ApplicationStatusDisplay.Onboarded
          );
        }).length;

        hiresCount.push(count);
      }
    }

    console.log('Days:', days); // Debug output
    console.log('Hires Count:', hiresCount); // Debug output

    const chartOptions = {
      title: {
        text: `New Hires from ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}`,
        left: 'center',
        top: 'top',
      },
      tooltip: {
        trigger: 'axis',
      },
      xAxis: {
        type: 'category',
        data: days,
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: hiresCount,
          type: 'line',
          smooth: true,
          itemStyle: {
            color: '#003f5c',
          },
          lineStyle: {
            color: '#003f5c',
          },
        },
      ],
    };

    chart.setOption(chartOptions);

    window.addEventListener('resize', () => {
      chart.resize();
    });
  }

  // renderCombinedChart() {
  //   if (!this.newCandidatesChartElement) {
  //     return;
  //   }

  //   const chartElement = this.newCandidatesChartElement.nativeElement;
  //   let chart = echarts.getInstanceByDom(chartElement);

  //   if (chart) {
  //     chart.dispose();
  //   }

  //   chart = echarts.init(chartElement, null, {
  //     devicePixelRatio: window.devicePixelRatio,
  //   });

  //   const days = [];
  //   const newCandidatesCount = [];
  //   const newHiresCount = [];
  //   const startDate = this.startDate || new Date();
  //   const endDate = this.endDate || new Date();
  //   const today = new Date(endDate);
  //   today.setHours(0, 0, 0, 0);

  //   if (startDate && endDate) {
  //     // Ensure startDate is at the start of the day
  //     startDate.setHours(0, 0, 0, 0);

  //     // Populate days and counts
  //     for (
  //       let i = 0;
  //       i <=
  //       Math.floor(
  //         (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  //       );
  //       i++
  //     ) {
  //       const date = new Date(startDate);
  //       date.setDate(startDate.getDate() + i);
  //       const day = date.toLocaleDateString('en-US', {
  //         weekday: 'short',
  //         month: 'short',
  //         day: 'numeric',
  //       });
  //       days.push(day);

  //       // Count new candidates
  //       const candidatesCount = this.jobcandidates.filter((candidate) => {
  //         const candidateDate = new Date(candidate.dateApplied);
  //         candidateDate.setHours(0, 0, 0, 0);
  //         return candidateDate.getTime() === date.getTime();
  //       }).length;
  //       newCandidatesCount.push(candidatesCount);

  //       // Count new hires
  //       const hiresCount = this.jobcandidates.filter((candidate) => {
  //         const candidateDate = new Date(candidate.dateApplied);
  //         candidateDate.setHours(0, 0, 0, 0);
  //         return (
  //           candidateDate.getTime() === date.getTime() &&
  //           candidate.applicationStatus === ApplicationStatusDisplay.Onboarded
  //         );
  //       }).length;
  //       newHiresCount.push(hiresCount);
  //     }
  //   }

  //   console.log('Days:', days); // Debug output
  //   console.log('New Candidates Count:', newCandidatesCount); // Debug output
  //   console.log('New Hires Count:', newHiresCount); // Debug output

  //   const chartOptions = {
  //     title: {
  //       text: `New Candidates and New Hires from ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}`,
  //       left: 'center',
  //       top: 'top',
  //     },
  //     tooltip: {
  //       trigger: 'axis',
  //     },
  //     legend: {
  //       data: ['New Candidates', 'New Hires'],
  //       top: 'bottom',
  //     },
  //     xAxis: {
  //       type: 'category',
  //       data: days,
  //     },
  //     yAxis: {
  //       type: 'value',
  //     },
  //     series: [
  //       {
  //         name: 'New Candidates',
  //         data: newCandidatesCount,
  //         type: 'line',
  //         stack: 'total',
  //         smooth: true,
  //         itemStyle: {
  //           color: '#003f5c',
  //         },
  //         lineStyle: {
  //           color: '#003f5c',
  //         },
  //       },
  //       {
  //         name: 'New Hires',
  //         data: newHiresCount,
  //         type: 'line',
  //         stack: 'total',
  //         smooth: true,
  //         itemStyle: {
  //           color: '#7a5195',
  //         },
  //         lineStyle: {
  //           color: '#7a5195',
  //         },
  //       },
  //     ],
  //   };

  //   chart.setOption(chartOptions);

  //   window.addEventListener('resize', () => {
  //     chart.resize();
  //   });
  // }


  renderJobOffersChart() {
    if (!this.jobOffersChartElement) {
      return;
    }

    const chartElement = this.jobOffersChartElement.nativeElement;
    let chart = echarts.getInstanceByDom(chartElement);

    if (chart) {
      chart.dispose();
    }

    chart = echarts.init(chartElement, null, {
      devicePixelRatio: window.devicePixelRatio,
    });

    const totalOffers = this.jobOffers.made;
    const acceptedOffers = this.jobOffers.accepted;
    const declinedOffers = this.jobOffers.declined;

    const chartOptions = {
      title: {
        text: `${acceptedOffers}`,
        subtext: 'Accepted',
        left: '49%',
        top: '30%', // Center vertically
        textAlign: 'center',
        textStyle: {
          fontSize: 70,
          fontWeight: 'bold',
        },
        subtextStyle: {
          fontSize: 18,
          color: '#999',
        },
      },
      tooltip: {
        trigger: 'item',
      },
      legend: {
        top: 'bottom',
        left: 'center',
        icon: 'circle',
        textStyle: {
          lineHeight: 10, // Adjust this value to set the line height
        },
        itemHeight: 15, // Adjust this value to match the size of the icon
        itemGap: 8, // Adjust the gap between legend items
        align: 'auto', // Center-aligns the legend items horizontally
      },
      series: [
        {
          type: 'pie',
          radius: ['60%', '70%'], // Adjust these values to make the donut bigger
          center: ['50%', '40%'],
          data: [
            {
              value: acceptedOffers,
              name: 'Accepted',
              itemStyle: { color: '#81c784' },
            }, // Green
            {
              value: totalOffers,
              name: 'Made',
              itemStyle: { color: '#ffb74d' },
            }, // Yellow
            {
              value: declinedOffers,
              name: 'Declined',
              itemStyle: { color: '#e57373' },
            }, // Red
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
          label: {
            show: false, // Hide labels
          },
          labelLine: {
            show: false, // Hide labels
          },
        },
      ],
      graphic: [
        {
          type: 'text',
          bottom: '10%', // Position this according to your needs
          left: 'center',
          style: {
            text: `${acceptedOffers} Accepted, ${totalOffers} Made, and ${declinedOffers} Declined`,
            textAlign: 'center',
            fill: '#333',
            fontSize: 18,
          },
        },
      ],
    };

    chart.setOption(chartOptions);
    // Re-center the chart on window resize
    window.addEventListener('resize', () => {
      chart.resize();
    });
  }
}
