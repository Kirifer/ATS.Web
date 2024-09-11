import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, throwError, of } from 'rxjs';
import { JobCandidate } from '../../../models/job-candidate';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import { environment } from '../../../../environments/environment';

import { ApplicationStatus, ApplicationStatusDisplay, SourcingToolDisplay, HRInChargeDisplay, NoticeDurationDisplay } from '../../../models/job-candidate';

@Component({
  selector: 'app-admin-job-candidate-existing',
  templateUrl: './admin-job-candidate-existing.component.html',
  styleUrl: './admin-job-candidate-existing.component.css'
})
export class AdminJobCandidateExistingComponent implements OnInit, AfterViewInit {
  startDate: Date | null = null;
  endDate: Date | null = null;

  ApplicationStatusDisplay = ApplicationStatusDisplay;

  displayedColumns: string[] = ['csequenceNo', 'candidateName', 'jobName', 'applicationStatus', 'interview_date', 'date_applied', 'actions'];
  dataSource = new MatTableDataSource<JobCandidate>();
  selectedJobCandidate: JobCandidate | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private http: HttpClient) { }

  jobcandidate$: Observable<JobCandidate[]> = of([]);
  ngOnInit() {
    this.http.get<{ data: JobCandidate[] }>(environment.jobcandidateUrl)
      .pipe(
        map(response => response.data),
        tap(data => {
          console.log('Data received from backend:', data);
          this.dataSource.data = this.filterByDate(data);
        }),
        catchError(error => {
          console.error('Error fetching candidates:', error);
          return throwError(error);
        })
      ).subscribe();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editElement(element: JobCandidate) {
    this.selectedJobCandidate = element;
  }

  closeEditor() {
    this.selectedJobCandidate = null;
  }

  // Method to get display name for application status
  getApplicationStatusDisplay(status: ApplicationStatus): string {
    return ApplicationStatusDisplay[status];
  }

  getApplicationStatusClass(status: ApplicationStatus): string {
    switch (status) {
      case ApplicationStatus.InitialInterview:
      case ApplicationStatus.TechnicalInterview:
      case ApplicationStatus.ClientInterview:
        return 'badge badge-primary rounded-pill d-inline';
      case ApplicationStatus.NoShow:
      case ApplicationStatus.NotShortlisted:
      case ApplicationStatus.Blacklisted:
        return 'badge badge-danger rounded-pill d-inline';
      case ApplicationStatus.RetractedApplication:
      case ApplicationStatus.WaitingForSuitableClient:
        return 'badge badge-warning rounded-pill d-inline';
      case ApplicationStatus.SalesAdvice:
      case ApplicationStatus.CongratulatoryEmail:
      case ApplicationStatus.JobOffer:
      case ApplicationStatus.ContractPreparation:
      case ApplicationStatus.Onboarded:
        return 'badge badge-success rounded-pill d-inline';
      default:
        return 'badge badge-secondary rounded-pill d-inline';
    }
  }


  getInterviewDate(candidate: any): string | null {
    if (candidate.applicationStatus === 'InitialInterview') {
      return candidate.initialInterviewSchedule ? candidate.initialInterviewSchedule.toString() : null;
    } else if (candidate.applicationStatus === 'TechnicalInterview') {
      return candidate.technicalInterviewSchedule ? candidate.technicalInterviewSchedule.toString() : null;
    } else if (candidate.applicationStatus === 'ClientInterview') {
      return candidate.clientFinalInterviewSchedule ? candidate.clientFinalInterviewSchedule.toString() : null;
    } else {
      return null;
    }
  }

  deleteElement(element: JobCandidate) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "#3085d6",
        cancelButton: "#d33"
      },
      buttonsStyling: true
    });

    swalWithBootstrapButtons.fire({
      title: "Are you sure?",
      text: `You are about to delete a candidate record. You won't be able to revert this!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`${environment.jobcandidateUrl}/${element.id}`)
          .pipe(
            tap(() => {
              console.log('Element deleted:', element);
              // Remove the deleted element from the data source
              this.dataSource.data = this.dataSource.data.filter(e => e !== element);
            }),
            catchError(error => {
              console.error('Error deleting element:', error);
              return throwError(error);
            })
          ).subscribe({
            next: () => {
              swalWithBootstrapButtons.fire({
                title: "Deleted!",
                text: "Your selected candidate record has been deleted.",
                icon: "success"
              });
            },
            error: (error) => {
              swalWithBootstrapButtons.fire({
                title: "Error!",
                text: "There was an error deleting the candidate record. Please try again.",
                icon: "error"
              });
            }
          });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        swalWithBootstrapButtons.fire({
          title: "Cancelled",
          text: "The candidate record was not deleted.",
          icon: "info"
        });
      }
    });
  }

  filterByDate(data: JobCandidate[]): JobCandidate[] {
    if (!this.startDate || !this.endDate) {
      return data;
    }
    return data.filter(candidate => {
      const dateApplied = new Date(candidate.dateApplied);
      return this.startDate && this.endDate && dateApplied >= this.startDate && dateApplied <= this.endDate;
    });
  }

  downloadData(dataType: 'JobCandidates') {
    const data = this.dataSource.data; // Get the data from dataSource
    const filteredData = this.filterByDate(data); // Apply filtering if necessary

    // Map your data to the desired column names
    const mappedData = filteredData.map((item: JobCandidate) => ({
      'Job Candidate Number': item.csequenceNo,
      'Name': item.candidateName,
      'Job Role Number': item.jobRoleId,
      'Job Role': item.jobName,
      'Sourcing Tools': SourcingToolDisplay[item.sourceTool],
      'HR In-Charge': HRInChargeDisplay[item.assignedHr],
      'Updated CV': item.candidateCv,
      'Email Address': item.candidateEmail,
      'Contact Number': item.candidateContact,
      'Asking Gross Salary': item.askingSalary,
      'Negotiable': item.salaryNegotiable,
      'Minimum Negotiated Salary': item.minSalary,
      'Maximum Negotiated Salary': item.maxSalary,
      'Availability': NoticeDurationDisplay[item.noticeDuration],
      'Date Applied': item.dateApplied,
      'Initial Interview Schedule': item.initialInterviewSchedule,
      'Technical Interview Schedule': item.technicalInterviewSchedule,
      'Client/Final Interview Schedule': item.clientFinalInterviewSchedule,
      'Background Verification': item.backgroundVerification,
      'Status': ApplicationStatusDisplay[item.applicationStatus],
      'Final Basic Salary': item.finalSalary,
      'Allowances': item.allowance,
      'Honorarium': item.honorarium,
      'Job Offer': item.jobOffer,
      'Job Contract': item.candidateContract,
      'Remarks': item.remarks,
      // Add other fields as needed
    }));

    const worksheet = XLSX.utils.json_to_sheet(mappedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, dataType);
    XLSX.writeFile(workbook, `${dataType}.xlsx`);
  }
}
