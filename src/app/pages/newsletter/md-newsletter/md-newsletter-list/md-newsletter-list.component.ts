import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { Subject, takeUntil } from 'rxjs';
import { DATATABLE_SETTINGS } from 'src/app/constants';
import { Company, Count, Newsletter } from 'src/app/core/models/loopback.model';
import { AppRoutes } from 'src/app/shared/system/AppRoutes';
import Swal from 'sweetalert2';
import { LoopbackService } from '../../../../core/services/loopback.service';

@Component({
  selector: 'app-md-newsletter-list',
  templateUrl: './md-newsletter-list.component.html',
  styleUrls: ['./md-newsletter-list.component.scss']
})
export class MDNewsletterListComponent implements OnInit {

  
  private unsubscribe = new Subject<void>();
  PAGE_SIZE = DATATABLE_SETTINGS.PAGE_SIZE;
  newsletterId: number;
  listNewsletter: Newsletter[] = [];
  isLoading = true;
  errors: HttpErrorResponse;
  countNewsletter: Count[] = [];
  searchTerm: string;
  page: number = 1;
  collectionSize: number;
  userId: number;

  constructor(
      private cdr: ChangeDetectorRef,
      private loopbackService: LoopbackService,
      private router: Router,
      private toastService: HotToastService,
      private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.listNewsletters();
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

  listNewsletters(): any {
    this.loopbackService
    .listNewsletter()
    .subscribe((response) => {
      console.log(response);
      this.listNewsletter = response
      this.cdr.detectChanges();
    });
  }

  delete(newsletterId: number): void {
      Swal.fire({
        title: 'Biztos benne, hogy törli ezt az elemet?',
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
              .deleteNewsletter(newsletterId)
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
                this.listNewsletters();
              },
              (error: HttpErrorResponse) => {
                this.errors = error;
              });  
        }
      })
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
