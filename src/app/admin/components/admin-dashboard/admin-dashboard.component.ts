// import { Component, OnInit } from '@angular/core';
// import * as echarts from 'echarts';

// @Component({
//   selector: 'app-admin-dashboard',
//   templateUrl: './admin-dashboard.component.html',
//   styleUrls: ['./admin-dashboard.component.css']
// })
// export class AdminDashboardComponent implements OnInit {
//   chartOption: any;
//   chartOption2: any;

//   ngOnInit(): void {
//     this.chartOption = {
//       tooltip: {
//         trigger: 'item',
//         formatter: '{a} <br/>{b}: {c} ({d}%)'
//       },
//       legend: {
//         data: [
//           'Direct',
//           'Marketing',
//           'Search Engine',
//           'Email',
//           'Union Ads',
//           'Video Ads',
//           'Baidu',
//           'Google',
//           'Bing',
//           'Others'
//         ]
//       },
//       series: [
//         {
//           name: 'Access From',
//           type: 'pie',
//           selectedMode: 'single',
//           radius: [0, '30%'],
//           label: {
//             position: 'inner',
//             fontSize: 14
//           },
//           labelLine: {
//             show: false
//           },
//           data: [
//             { value: 1548, name: 'Search Engine' },
//             { value: 775, name: 'Direct' },
//             { value: 679, name: 'Marketing', selected: true }
//           ]
//         },
//         {
//           name: 'Access From',
//           type: 'pie',
//           radius: ['45%', '60%'],
//           labelLine: {
//             length: 30
//           },
//           label: {
//             formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
//             backgroundColor: '#F6F8FC',
//             borderColor: '#8C8D8E',
//             borderWidth: 1,
//             borderRadius: 4,
//             rich: {
//               a: {
//                 color: '#6E7079',
//                 lineHeight: 22,
//                 align: 'center'
//               },
//               hr: {
//                 borderColor: '#8C8D8E',
//                 width: '100%',
//                 borderWidth: 1,
//                 height: 0
//               },
//               b: {
//                 color: '#4C5058',
//                 fontSize: 14,
//                 fontWeight: 'bold',
//                 lineHeight: 33
//               },
//               per: {
//                 color: '#fff',
//                 backgroundColor: '#4C5058',
//                 padding: [3, 4],
//                 borderRadius: 4
//               }
//             }
//           },
//           data: [
//             { value: 1048, name: 'Baidu' },
//             { value: 335, name: 'Direct' },
//             { value: 310, name: 'Email' },
//             { value: 251, name: 'Google' },
//             { value: 234, name: 'Union Ads' },
//             { value: 147, name: 'Bing' },
//             { value: 135, name: 'Video Ads' },
//             { value: 102, name: 'Others' }
//           ]
//         }
//       ]
//     };

//     this.chartOption2={
//       title: {
//         text: 'Stacked Line'
//       },
//       tooltip: {
//         trigger: 'axis'
//       },
//       legend: {
//         data: ['Email', 'Union Ads', 'Video Ads', 'Direct', 'Search Engine']
//       },
//       grid: {
//         left: '3%',
//         right: '4%',
//         bottom: '3%',
//         containLabel: true
//       },
//       toolbox: {
//         feature: {
//           saveAsImage: {}
//         }
//       },
//       xAxis: {
//         type: 'category',
//         boundaryGap: false,
//         data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
//       },
//       yAxis: {
//         type: 'value'
//       },
//       series: [
//         {
//           name: 'Email',
//           type: 'line',
//           stack: 'Total',
//           data: [120, 132, 101, 134, 90, 230, 210]
//         },
//         {
//           name: 'Union Ads',
//           type: 'line',
//           stack: 'Total',
//           data: [220, 182, 191, 234, 290, 330, 310]
//         },
//         {
//           name: 'Video Ads',
//           type: 'line',
//           stack: 'Total',
//           data: [150, 232, 201, 154, 190, 330, 410]
//         },
//         {
//           name: 'Direct',
//           type: 'line',
//           stack: 'Total',
//           data: [320, 332, 301, 334, 390, 330, 320]
//         },
//         {
//           name: 'Search Engine',
//           type: 'line',
//           stack: 'Total',
//           data: [820, 932, 901, 934, 1290, 1330, 1320]
//         }
//       ]
//     };
//   }

//   ngAfterViewInit(): void {
//     const chartDom = document.getElementById('main')!;
//     const myChart = echarts.init(chartDom);
//     myChart.setOption(this.chartOption);

//     // Initialize the second chart
//     const chartDom2 = document.getElementById('chart2')!;
//     const myChart2 = echarts.init(chartDom2);
//     myChart2.setOption(this.chartOption2);
//   }
// }


// import { Component} from '@angular/core';

// @Component({
//   selector: 'app-admin-dashboard',
//   templateUrl: './admin-dashboard.component.html',
//   styleUrls: ['./admin-dashboard.component.css']
// })
// export class AdminDashboardComponent{

// }

import { Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JobCandidate } from '../../../models/job-candidate';
import { JobRoles } from '../../../models/job-roles';
import { catchError, map, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import * as echarts from 'echarts';

import {ApplicationStatusDisplay, SourcingToolDisplay, HRInChargeDisplay} from '../../../models/job-candidate';
import {HiringManagerDisplay, HiringTypeDisplay, JobLocationDisplay, JobStatusDisplay, RoleLevelDisplay, ShiftScheduleDisplay } from '../../../models/job-roles';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  @ViewChild('sourcingToolChart') sourcingToolChartElement!: ElementRef;
  @ViewChild('hrChart') hrChartElement!: ElementRef;
  @ViewChild('applicantFunnelChart') applicantFunnelChartElement!: ElementRef;

  @ViewChild('jobOffersChart') jobOffersChartElement!: ElementRef;



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
  jobOffers: { made: number, accepted: number, declined: number } = { made: 0, accepted: 0, declined: 0 };
  newHiresCount: number = 0;
  avgTimeToFill: number = 0;
  agingCandidates: { jobName: string, aging: string | undefined }[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.fetchCandidates();
    this.fetchJobRoles();
  }

  ngAfterViewInit() {
    this.renderSourcingToolChart();
    this.renderSourcingHRChart();
    this.renderApplicantFunnelChart();
    this.renderJobOffersChart();
  }

  fetchCandidates() {
    this.http.get<{ data: JobCandidate[], code: number, succeeded: boolean }>('https://localhost:7012/jobcandidate')
      .pipe(
        map(response => response.data),
        tap(data => {
          console.log('Data received from backend:', data);
          this.jobcandidates = data;
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
        }),
        catchError(error => {
          console.error('Error fetching candidates:', error);
          return throwError(error);
        })
      ).subscribe();
  }


  fetchJobRoles() {
    this.http.get<{ data: JobRoles[], code: number, succeeded: boolean }>('https://localhost:7012/jobrole')
      .pipe(
        map(response => response.data),
        tap(data => {
          console.log('Data received from backend:', data);
          this.jobroles = data;
          this.fillRatePercentage = this.getFillRate();
          this.activeJobsCount = this.getActiveJobsCount();
          this.avgTimeToFill = this.getTimeToFill();
          this.agingCandidates = this.getAgingCandidates();

          this.renderJobOffersChart();
        }),
        catchError(error => {
          console.error('Error fetching job roles:', error);
          return throwError(error);
        })
      ).subscribe();
  }

  // Reports Section

  // 1. Sourcing Tools Analytics
  getSourcingToolAnalytics() {
    const toolCounts: { [key: string]: number } = {};
    this.jobcandidates.forEach(candidate => {
      const tool = candidate.sourceTool;
      const displayTool = SourcingToolDisplay[tool];
      toolCounts[displayTool] = (toolCounts[displayTool] || 0) + 1;
    });
    return toolCounts;
  }

  // 2. Fill Rate
  getFillRate(): number {
    const filledPositions = this.jobroles.filter(role => role.jobStatus === 'FilledPosition').length;
    const totalPositions = this.jobroles.filter(role => role.jobStatus !== 'Cancelled').length;
    return totalPositions > 0 ? (filledPositions / totalPositions) * 100 : 0;
  }

  // 3. Applicant Funnel (Application Status)
  getApplicationStatusCount() {
    const statusCounts: { [key: string]: number } = {};

    // Initialize statusCounts with all possible statuses. This is for showing all the statuses including those with 0 values.
    // Object.values(ApplicationStatusDisplay).forEach(displayStatus => {
    //   statusCounts[displayStatus] = 0;
    // });

    this.jobcandidates.forEach(candidate => {
      const status = candidate.applicationStatus;
      const displayStatus = ApplicationStatusDisplay[status];
      statusCounts[displayStatus] = (statusCounts[displayStatus] || 0) + 1;
    });

    return statusCounts;
  }

  // 4. Sourced by Recruiter
  getCandidatesSourcedByHr() {
    const hrCounts: { [key: string]: number } = {};
    this.jobcandidates.forEach(candidate => {
      const hr = candidate.assignedHr;
      const displayHr = HRInChargeDisplay[hr];
      hrCounts[displayHr] = (hrCounts[displayHr] || 0) + 1;
    });
    return hrCounts;
  }

  // 5. Total Number of Candidates per Position
  getCandidatesPerPosition() {
    const positionCounts: { [key: string]: number } = {};
    this.jobcandidates.forEach(candidate => {
      const position = candidate.jobName;
      positionCounts[position] = (positionCounts[position] || 0) + 1;
    });
    return positionCounts;
  }

  // 6. Active Jobs
  getActiveJobsCount() {
    return this.jobroles.filter(role =>
      ['Sourcing Candidates', 'For Client Presentation', 'Client Interview'].includes(role.jobStatus)
    ).length;
  }

  // Progress Section

  // 1. New Candidates
  getNewCandidates(): number {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return this.jobcandidates.filter(candidate =>
      new Date(candidate.dateApplied) >= sevenDaysAgo
    ).length;
  }

  // 2. For Interview Candidates
  getForInterviewCandidates(): number {
    return this.jobcandidates.filter(candidate =>
      ['InitialInterview', 'TechnicalInterview', 'ClientInterview'].includes(candidate.applicationStatus)
    ).length;
  }

  // 3. Job Offer (Made, Accepted, Declined)
  getJobOffers() {
    const jobOffers = {
      made: 0,
      accepted: 0,
      declined: 0
    };

    this.jobcandidates.forEach(candidate => {
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
    return this.jobcandidates.filter(candidate => candidate.applicationStatus === ApplicationStatusDisplay.Onboarded).length;
  }

  // 5. Time to Fill (Job Roles)
  getTimeToFill(): number {
    const filledJobs = this.jobroles.filter(role => role.jobStatus === 'FilledPosition');
    const totalDays = filledJobs.reduce((sum, role) => sum + (role.daysCovered || 0), 0);
    return filledJobs.length > 0 ? totalDays / filledJobs.length : 0;
  }

  // 6. Interview Planner
  getInterviewPlanner() {
    return this.jobcandidates.filter(candidate =>
      candidate.initialInterviewSchedule ||
      candidate.technicalInterviewSchedule ||
      candidate.clientFinalInterviewSchedule
    );
  }

  // 7. Aging
  getAgingCandidates() {
    return this.jobroles.map(role => ({
      jobName: role.jobName,
      aging: role.aging
    }));
  }

  //Charts
  renderSourcingToolChart() {
    if (!this.sourcingToolChartElement) {
      return;
    }

    const chartElement = this.sourcingToolChartElement.nativeElement;

    // Ensure the canvas has the correct dimensions
    const width = chartElement.clientWidth;
    const height = chartElement.clientHeight;
    chartElement.width = width * window.devicePixelRatio;
    chartElement.height = height * window.devicePixelRatio;

    let chart = echarts.getInstanceByDom(chartElement);

    if (chart) {
      chart.dispose();
    }

    chart = echarts.init(chartElement, null, { devicePixelRatio: window.devicePixelRatio });

    const chartOptions = {
      title: {
        text: 'Sourcing Tool Analytics',
        left: 'center',
        top: 'top'
      },
      tooltip: {
        trigger: 'item'
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
      color: ['#e57373', '#7986cb', '#f06292', '#ffb74d', '#81c784', '#f9dad9', '#e2e2f8', '#f6d9ed', '#fdf0cc', '#d9eed8'], // Custom colors
      series: [
        {
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['50%', '60%'],
          startAngle: 180,
          endAngle: 360,
          data: Object.entries(this.sourcingToolAnalytics).map(([name, value]) => ({ value, name })),
          label: {
            // position: 'outside',
            // formatter: '{b}: {c}'
            show: false // Hide labels
          },
          labelLine: {
            // length: 15,
            // lineStyle: {
            //   width: 1,
            //   type: 'solid'
            // }
            show: false // Hide labels
          }
        }
      ]
    };

    chart.setOption(chartOptions);
  }


  renderSourcingHRChart() {
    if (!this.hrChartElement) {
      return;
    }

    const chartElement = this.hrChartElement.nativeElement;
    const chart = echarts.init(chartElement, null, { devicePixelRatio: window.devicePixelRatio });

    const hrNames = Object.keys(this.candidatesSourcedByHr);
    const hrCounts = Object.values(this.candidatesSourcedByHr);

    const chartOptions = {
      title: {
        text: 'Sourced by Recruiter',
        left: 'center',
        top: 'top'
      },
      tooltip: {
        trigger: 'item',
        axisPointer: {
          type: 'shadow'
        },
      },
      xAxis: {
        type: 'category',
        data: hrNames,
        axisLabel: {
          rotate: 45,  // Rotate labels for better readability if necessary
        },
        axisTick: {
          alignWithLabel: true
        }
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: hrCounts.map((value, index) => ({
            value,
            itemStyle: {
              color: ['#e57373', '#7986cb', '#f06292', '#ffb74d', '#81c784'][index % 5]  // Cycle through colors
            }
          })),
          type: 'bar',
          barWidth: '50%',
          showBackground: true,
          backgroundStyle: {
            color: 'rgba(180, 180, 180, 0.2)'
          }
        }
      ]
    };

    chart.setOption(chartOptions);
  }

  renderApplicantFunnelChart() {
    if (!this.applicantFunnelChartElement) {
      return;
    }

    const chartElement = this.applicantFunnelChartElement.nativeElement;
    const chart = echarts.init(chartElement, null, { devicePixelRatio: window.devicePixelRatio });

    const funnelData = Object.entries(this.applicationStatusCount).map(([name, value], index) => ({
      value,
      name,
      itemStyle: {
        color: ['#e57373', '#7986cb', '#f06292', '#ffb74d', '#81c784', '#f9dad9', '#e2e2f8', '#f6d9ed', '#fdf0cc', '#d9eed8'][index % 10]  // Use colors cyclically
      }
    }));

    const chartOptions = {
      title: {
        text: 'Applicant Funnel',
        left: 'center',
        top: 'top'
      },
      tooltip: {
        trigger: 'item',
      },
      legend: {
        data: Object.keys(this.applicationStatusCount),
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
          type: 'funnel',
          left: '10%',
          top: 30,
          bottom: 80,
          width: '80%',
          min: 0,
          max: Math.max(...Object.values(this.applicationStatusCount)),
          minSize: '0%',
          maxSize: '80%',
          sort: 'descending',
          gap: 2,
          label: {
            show: true,
            position: 'inside'
          },
          labelLine: {
            length: 10,
            lineStyle: {
              width: 1,
              type: 'solid'
            }
          },
          itemStyle: {
            borderColor: '#fff',
            borderWidth: 1
          },
          emphasis: {
            label: {
              fontSize: 15
            }
          },
          data: funnelData
        }
      ]
    };

    chart.setOption(chartOptions);
  }

  renderJobOffersChart() {
    if (!this.jobOffersChartElement) {
      return;
    }

    const chartElement = this.jobOffersChartElement.nativeElement;
    const chart = echarts.init(chartElement, null, { devicePixelRatio: window.devicePixelRatio });

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
          color: '#999'
        }
      },
      tooltip: {
        trigger: 'item'
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
          radius: ['60%', '70%'],  // Adjust these values to make the donut bigger
          center: ['50%', '40%'],
          data: [
            { value: acceptedOffers, name: 'Accepted', itemStyle: { color: '#81c784' } }, // Green
            { value: totalOffers, name: 'Made', itemStyle: { color: '#ffb74d' } }, // Yellow
            { value: declinedOffers, name: 'Declined', itemStyle: { color: '#e57373' } } // Red
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          label: {
            // position: 'outside',
            // formatter: '{b}: {c}'
            show: false // Hide labels
          },
          labelLine: {
            // length: 15,
            // lineStyle: {
            //   width: 1,
            //   type: 'solid'
            // }
            show: false // Hide labels
          }
        }
      ],
      graphic: [
        {
            type: 'text',
            bottom: '10%', // Position this according to your needs
            left: 'center',
            style: {
                text: `${acceptedOffers} Accepted, ${totalOffers} Made, and ${declinedOffers} Rejected`,
                textAlign: 'center',
                fill: '#333',
                fontSize: 18,
            }
        }
    ]
    };

    chart.setOption(chartOptions);
  }



}
