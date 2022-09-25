import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { DATATABLE_SETTINGS } from 'src/app/constants';
import { Company, Count, Newsletter } from 'src/app/core/models/loopback.model';
import { AppRoutes } from 'src/app/shared/system/AppRoutes';
import Swal from 'sweetalert2';
import { LoopbackService } from '../../../../core/services/loopback.service';

@Component({
  selector: 'app-hc-subscriber-list',
  templateUrl: './hc-subscriber-list.component.html',
  styleUrls: ['./hc-subscriber-list.component.scss']
})
export class HCSubscriberListComponent implements OnInit, OnDestroy {
  private loadingSubject: BehaviorSubject<boolean> =
  new BehaviorSubject<boolean>(false);
  
  private unsubscribe = new Subject<void>();
  PAGE_SIZE = DATATABLE_SETTINGS.PAGE_SIZE;
  newsletterId: number;
  listNewsletter: Newsletter[] = [];
  allNewsletter: Company[];
  isLoading = true;
  errors: HttpErrorResponse;
  countNewsletter: Count[] = [];
  searchTerm: string;
  page: number = 1;
  collectionSize: number;
  public siteId?: 'hc';
  cols: any[] = [];
  listActive: any[] = [];

  constructor(
      private cdr: ChangeDetectorRef,
      private loopbackService: LoopbackService,
      private router: Router,
      private toastService: HotToastService,
      private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.listNewsletters();
    this.loadStatus();
    this.loadTableColumns();
  }
  
  // countTags(): any {
  //   this.loopbackService
  //   .listTagsCount()
  //   .subscribe((response) => {
  //     console.log(response);
  //     this.countTag = response
  //     this.cdr.detectChanges();
  // });

  loadTableColumns(): any {
    this.cols = [
      { field: 'name', header: 'Név' },
      { field: 'email', header: 'Céges e-mail cím' },
      { field: 'createTime', header: 'Feliratkozás ideje' },
      { field: 'actions', header: 'Műveletek' }        
    ];
  }

  loadStatus() {
    const active = 
      { id: 0, name: 'aktív', value: 1 };
    const inactive = 
      { id: 1, name: 'inaktív', value: 0 };
  
      this.listActive.push(active);
      this.listActive.push(inactive);
      this.loadingSubject.next(false);
  }

  listNewsletters(): any {
    this.loopbackService
    .listEmailSubscriber()
    .subscribe((response) => {
      this.listNewsletter = response;
      this.loadingSubject.next(false);
      this.cdr.detectChanges();
    });
  }

  delete(newsletterId: number): void {
      Swal.fire({
        title: 'Biztos törlöd ezt a hírlevelet?',
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
              .deleteEmailSubscriber(newsletterId)
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

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
