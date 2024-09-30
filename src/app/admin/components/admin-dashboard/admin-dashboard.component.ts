import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApplicationStatus, ApplicationStatusDisplay, HRInChargeDisplay, JobCandidate, SourcingToolDisplay } from '../../../models/job-candidate';
import { JobRoles, JobStatus } from '../../../models/job-roles';
import { catchError, map, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import * as echarts from 'echarts';
import * as XLSX from 'xlsx';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { environment } from '../../../../environments/environment';

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
  @ViewChild('activeJobsChart') activeJobsChart!: ElementRef;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  jobcandidates: JobCandidate[] = [];
  jobroles: JobRoles[] = [];
  sourcingToolAnalytics: { [key: string]: number } = {};
  applicationStatusCount: { [key: string]: number } = {};
  candidatesSourcedByHr: { [key: string]: number } = {};
  candidatesPerPosition: { [key: string]: number } = {};
  jobOffers: { made: number; accepted: number; declined: number } = { made: 0, accepted: 0, declined: 0 };
  fillRatePercentage = 0;
  activeJobsCount = 0;
  newCandidatesCount = 0;
  forInterviewCandidatesCount = 0;
  newHiresCount = 0;
  avgTimeToFill: { jobName: string; timeToFill: number | undefined }[] = [];
  agingCandidates: { jobName: string; aging: string | undefined }[] = [];
  displayedColumns: string[] = ['jobName', 'timeToFill', 'aging'];
  dataSource = new MatTableDataSource<any>([]);

  timePeriods = [
    { value: 'last7days', label: 'Last 7 Days' },
    { value: 'last14days', label: 'Last 14 Days' },
    { value: 'last30days', label: 'Last 30 Days' },
    { value: 'last60days', label: 'Last 60 Days' },
    { value: 'last90days', label: 'Last 90 Days' },
    { value: 'last6months', label: 'Last 6 Months' },
    { value: 'last1year', label: 'Last 1 Year' },
  ];

  selectedPeriod = 'last7days';
  startDate: Date | null = null;
  endDate: Date | null = null;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.setDefaultDateRange();
    this.fetchCandidates();
    this.fetchJobRoles();
  }

  setDefaultDateRange() {
    const now = new Date();
    this.endDate = new Date(now);
    this.startDate = new Date();
    this.startDate.setDate(now.getDate() - 7); // Ensure startDate is 7 days ago
  }


  ngAfterViewInit() {
    this.initializeCharts();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  initializeCharts() {
    this.renderSourcingToolChart();
    this.renderSourcingHRChart();
    this.renderApplicantFunnelChart();
    this.renderCandidatesPerPositionChart();
    this.renderJobOffersChart();
    this.renderNewCandidatesChart();
    this.renderForInterviewCandidatesChart();
    this.renderNewHiresLineChart();
    this.renderActiveJobsChart();
  }

  fetchCandidates() {
    this.http
      .get<{ data: JobCandidate[] }>(environment.jobcandidateUrl)
      .pipe(
        map(response => response.data),
        tap(data => {
          this.jobcandidates = this.filterByDate(data);
          this.updateCandidateAnalytics();
          this.initializeCharts();
        }),
        catchError(error => {
          console.error('Error fetching candidates:', error);
          return throwError(error);
        })
      )
      .subscribe(() => this.combineData());
  }

  fetchJobRoles() {
    this.http
      .get<{ data: JobRoles[] }>(environment.jobroleUrl)
      .pipe(
        map(response => response.data),
        tap(data => {
          this.jobroles = this.filterByDate(data);
          this.updateJobRoleAnalytics();
        }),
        catchError(error => {
          console.error('Error fetching job roles:', error);
          return throwError(error);
        })
      )
      .subscribe(() => this.combineData());
  }

  filterByDate(data: any[]): any[] {
    if (this.startDate && this.endDate) {
      return data.filter(item => {
        const date = new Date(item.dateApplied || item.openDate);
        return this.startDate !== null && this.endDate !== null && date >= this.startDate && date <= this.endDate;
      });
    }
    return data;
  }

  updateCandidateAnalytics() {
    this.sourcingToolAnalytics = this.getSourcingToolAnalytics();
    this.applicationStatusCount = this.getApplicationStatusCount();
    this.candidatesSourcedByHr = this.getCandidatesSourcedByHr();
    this.candidatesPerPosition = this.getCandidatesPerPosition();
    this.newCandidatesCount = this.getNewCandidates();
    this.forInterviewCandidatesCount = this.getForInterviewCandidates();
    this.jobOffers = this.getJobOffers();
    this.newHiresCount = this.getNewHires();
  }

  updateJobRoleAnalytics() {
    this.fillRatePercentage = this.getFillRate();
    this.activeJobsCount = this.getActiveJobsCount();
    this.avgTimeToFill = this.getTimeToFill();
    this.agingCandidates = this.getAgingCandidates();
  }

  onPeriodChange() {
    const now = new Date();
    const periods: { [key: string]: number } = {
      last7days: 7,
      last14days: 14,
      last30days: 30,
      last60days: 60,
      last90days: 90,
      last6months: 180,
      last1year: 365,
    };
    const days = periods[this.selectedPeriod] || 7;
    this.startDate = new Date();
    this.startDate.setDate(now.getDate() - days);
    this.endDate = new Date(); // End date is today

    // Fetch and filter candidates and job roles based on the new date range
    this.fetchCandidates();
    this.fetchJobRoles();
  }

  onCustomDateChange() {
    // Ensure startDate and endDate are valid
    if (this.startDate && this.endDate && this.startDate <= this.endDate) {
      this.fetchCandidates();
      this.fetchJobRoles();
    }
  }


  combineData() {
    const jobMap = new Map<string, any>();

    this.agingCandidates.forEach(candidate => {
      jobMap.set(candidate.jobName, { ...candidate });
    });

    this.avgTimeToFill.forEach(data => {
      if (jobMap.has(data.jobName)) {
        jobMap.get(data.jobName).timeToFill = data.timeToFill;
      } else {
        jobMap.set(data.jobName, { jobName: data.jobName, timeToFill: data.timeToFill });
      }
    });

    this.dataSource.data = Array.from(jobMap.values());
  }

  downloadData(dataType: 'JobCandidates' | 'JobRoles') {
    const data = dataType === 'JobCandidates' ? this.jobcandidates : this.jobroles;
    const filteredData = this.filterByDate(data);
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, dataType);
    XLSX.writeFile(workbook, `${dataType}.xlsx`);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  downloadExcel() {
    const workbook = XLSX.utils.book_new();

    // REPORTS Sheet
    const reportsData = [
      { Title: 'Sourcing Tool Analytics', ...this.getSourcingToolAnalytics() },
      { Title: 'Applicant Funnel', ...this.getApplicationStatusCount() },
      { Title: 'Sourced by Recruiter', ...this.getCandidatesSourcedByHr() },
      { Title: 'Total Number of Candidates per Position', ...this.getCandidatesPerPosition() },
      { Title: 'Active Jobs', Count: this.getActiveJobsCount() },
    ];

    const reportsSheet = XLSX.utils.json_to_sheet(reportsData, { skipHeader: true });
    XLSX.utils.book_append_sheet(workbook, reportsSheet, 'REPORTS');

    // PROGRESS Sheet
    const progressData = [
      { Title: 'New Candidates', Count: this.getNewCandidates() },
      { Title: 'For Interview Candidates', Count: this.getForInterviewCandidates() },
      { Title: 'Job Offer - Made', Count: this.getJobOffers().made },
      { Title: 'Job Offer - Accepted', Count: this.getJobOffers().accepted },
      { Title: 'Job Offer - Declined', Count: this.getJobOffers().declined },
      { Title: 'New Hires', Count: this.getNewHires() },
      { Title: 'Time to Fill', ...this.getTimeToFill().reduce((acc, curr) => ({ ...acc, [curr.jobName]: curr.timeToFill }), {}) },
      { Title: 'Aging', ...this.getAgingCandidates().reduce((acc, curr) => ({ ...acc, [curr.jobName]: curr.aging }), {}) },
    ];

    const progressSheet = XLSX.utils.json_to_sheet(progressData, { skipHeader: true });
    XLSX.utils.book_append_sheet(workbook, progressSheet, 'PROGRESS');

    // Save the file
    XLSX.writeFile(workbook, 'Reports_Progress.xlsx');
  }
  // ... (Keep all other methods for rendering charts, analytics, and calculations)

  // REPORTS SECTION

  // 1. Sourcing Tools Analytics
  getSourcingToolAnalytics() {
    const toolCounts: { [key: string]: number } = {};
    this.jobcandidates.forEach((candidate) => {
      const tool = candidate.sourceTool;
      const displayTool = SourcingToolDisplay[tool] || tool; // Default to tool if display mapping not found
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

    this.jobcandidates.forEach((candidate) => {
      const status = candidate.applicationStatus;
      const displayStatus = ApplicationStatusDisplay[status] || status; // Default to status if display mapping not found
      statusCounts[displayStatus] = (statusCounts[displayStatus] || 0) + 1;
    });

    // Ensure all statuses are represented in the result, even if their count is zero
    Object.values(ApplicationStatusDisplay).forEach((displayStatus) => {
      if (!(displayStatus in statusCounts)) {
        statusCounts[displayStatus] = 0;
      }
    });

    return statusCounts;
  }


  // 4. Sourced by Recruiter
  getCandidatesSourcedByHr() {
    const hrCounts: { [key: string]: number } = {};
    this.jobcandidates.forEach((candidate) => {
      const hr = candidate.assignedHr;
      const displayHr = HRInChargeDisplay[hr] || hr; // Default to HR if display mapping not found
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
    [
      JobStatus.SourcingCandidates,
      JobStatus.ForClientPresentation,
      JobStatus.ClientInterview
    ].includes(role.jobStatus)
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
    const startDate = this.startDate || new Date(); // Use startDate from a dynamic range if provided
    return this.jobcandidates.filter(
      (candidate) => new Date(candidate.dateApplied) >= startDate
    ).length;
  }


  // 2. For Interview Candidates
  getForInterviewCandidates(): number {
    return this.jobcandidates.filter((candidate) =>
      [
        ApplicationStatus.InitialInterview,
        ApplicationStatus.TechnicalInterview,
        ApplicationStatus.ClientInterview
      ].includes(candidate.applicationStatus)
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
  getTimeToFill() {
    return this.jobroles
      .filter((job) => job.closedDate && job.openDate) // Ensure both dates are present
      .map((job) => {
        const closedDate = job.closedDate ? new Date(job.closedDate) : null;
        const openDate = job.openDate ? new Date(job.openDate) : null;

        if (closedDate !== null && openDate !== null && (isNaN(closedDate.getTime()) || isNaN(openDate.getTime()))) {
          return {
            jobName: job.jobName,
            timeToFill: 0, // Default to 0 if dates are invalid
          };
        }

        const timeToFill =
          closedDate && openDate ? (closedDate.getTime() - openDate.getTime()) / (1000 * 60 * 60 * 24) : 0;
        return {
          jobName: job.jobName,
          timeToFill: timeToFill,
        };
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
      let postedDate = role.openDate ? new Date(role.openDate) : new Date(0);

      // Validate the date
      if (isNaN(postedDate.getTime())) {
        postedDate = new Date(0); // Fallback to a default date if invalid
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
          width: '70%',
          left: '5%',
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

  renderActiveJobsChart(): void {
    const chartElement = this.activeJobsChart.nativeElement;
    let chart = echarts.getInstanceByDom(chartElement);
  
    if (chart) {
      chart.dispose(); // Dispose of the chart if it exists
    }
  
    chart = echarts.init(chartElement, null, {
      devicePixelRatio: window.devicePixelRatio, // Ensure chart adjusts for screen resolution
    });
  
    const activeJobsCount = this.getActiveJobsCount();
  
    const chartOptions = {
      title: {
        text: `${activeJobsCount}`,
        subtext: 'Active Jobs',
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
        show: false, // Disable tooltip since it's unnecessary
      },
      legend: {
        show: false, // Hide the legend
      },
      series: [
        {
          type: 'pie',
          radius: ['60%', '70%'], // Make the donut chart
          center: ['50%', '40%'],
          data: [
            {
              value: activeJobsCount,
              name: 'Active Jobs',
              itemStyle: { color: '#81c784' }, // Green color for active jobs
            },
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
            show: false, // Hide label lines
          },
        },
      ],
      graphic: [
        {
          type: 'text',
          bottom: '10%', // Position this based on your needs
          left: 'center',
          style: {
            text: `${activeJobsCount} Active Jobs`,
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
