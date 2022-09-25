import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { HotToastService } from '@ngneat/hot-toast';
import { Subject, takeUntil } from 'rxjs';
import { DATATABLE_SETTINGS } from 'src/app/constants';
import { Office, OfficeUserEmployee, UserEmployee } from 'src/app/core/models/loopback.model';
import { AppRoutes } from 'src/app/shared/system/AppRoutes';
import Swal from 'sweetalert2';
import { LoopbackService } from '../../../core/services/loopback.service';

@Component({
  selector: 'app-offices-list',
  templateUrl: './offices-list.component.html',
  styleUrls: ['./offices-list.component.scss']
})
export class OfficesListComponent implements OnInit {
  private unsubscribe = new Subject<void>();
  PAGE_SIZE = DATATABLE_SETTINGS.PAGE_SIZE;
  officeId: number;
  listOffice: Office[] = [];
  officeUserEmployee: OfficeUserEmployee[] = [];
  defaultSalesUserId: UserEmployee[] = [];
  userId: number;
  allOffice: Office[];
  isLoading = true;
  errors: HttpErrorResponse;
  countOffice: number;
  searchTerm: string;
  page: number = 1;
  collectionSize: number;

  constructor(
      private cdr: ChangeDetectorRef,
      private loopbackService: LoopbackService,
      private router: Router,
      private toastService: HotToastService,
      private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.listOffices();
    this.countOffices();
  }
  
  countOffices(): any {
      this.loopbackService
      .listTagsCount()
      .subscribe((response) => {
        console.log(response);
        this.countOffice = response.count;
        this.cdr.detectChanges();
    });
  }

  listOffices(): any {
    this.loopbackService
    .listOffice()
    .subscribe((response) => {
      this.listOffice = response;
      this.cdr.detectChanges();
    });
  }

  delete(officeId: number): void {
      Swal.fire({
        title: 'Biztos törlöd ezt az irodát?',
        text: "Utána nem tudod visszaállítani!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Igen',
        cancelButtonText: 'Nem'
      }).then((result) => {
        if (result.value) {
            this.loopbackService
              .deleteOffice(officeId)
              .pipe(
                this.toastService.observe({
                loading: 'Folyamantban...',
                success: 'Sikeres törlés',
                error: 'Hiba történt'
              }),
                takeUntil(this.unsubscribe)
              )
              .subscribe(
              () => {
                this.listOffices();
              },
              (error: HttpErrorResponse) => {
                this.errors = error;
              });  
        }
      })
  }

  edit(officeId: number): void {
    this.router
      .navigateByUrl(`${AppRoutes.OFFICES}/detail/${officeId}`)
      .then();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
