import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { Subject, takeUntil } from 'rxjs';
import { DATATABLE_SETTINGS } from 'src/app/constants';
import { Company, Count } from 'src/app/core/models/loopback.model';
import { AppRoutes } from 'src/app/shared/system/AppRoutes';
import Swal from 'sweetalert2';
import { LoopbackService } from '../../../core/services/loopback.service';

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.scss']
})
export class CompanyListComponent implements OnInit {

  private unsubscribe = new Subject<void>();
  PAGE_SIZE = DATATABLE_SETTINGS.PAGE_SIZE;
  companyId: number;
  listCompany: Company[] = [];
  allCompany: Company[];
  isLoading = true;
  errors: HttpErrorResponse;
  countCompany: Count[] = [];
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
    this.listCompanys();
    //this.countTags();
  }
  
  // countTags(): any {
  //   this.loopbackService
  //   .listTagsCount()
  //   .subscribe((response) => {
  //     console.log(response);
  //     this.countTag = response
  //     this.cdr.detectChanges();
  // });

  listCompanys(): any {
    this.loopbackService
    .listCompany()
    .subscribe((response) => {
      this.listCompany = response;
      this.cdr.detectChanges();
    });
  }

  delete(companyId: number): void {
      Swal.fire({
        title: 'Biztos törlöd ezt a céget?',
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
              .deleteCompany(companyId)
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
                this.listCompanys();
              },
              (error: HttpErrorResponse) => {
                this.errors = error;
              });  
        }
      })
  }

  edit(companyId: number): void {
    this.router
      .navigateByUrl(`${AppRoutes.COMPANY}/detail/${companyId}`)
      .then();
  }

  // search(value: string): void {
  //   this.listCompany = this.allCompany.filter((val) => val.name.toLowerCase().includes(value));
  //   this.collectionSize = this.listCompany.length;
  // }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
