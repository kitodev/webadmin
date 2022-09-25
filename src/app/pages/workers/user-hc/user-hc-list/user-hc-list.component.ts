import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { Subject } from 'rxjs';
import { DATATABLE_SETTINGS } from 'src/app/constants';
import { UserHc, Users } from 'src/app/core/models/loopback.model';
import { LoopbackService } from 'src/app/core/services/loopback.service';
import { AppRoutes } from 'src/app/shared/system/AppRoutes';

@Component({
  selector: 'app-user-hc-list',
  templateUrl: './user-hc-list.component.html',
  styleUrls: ['./user-hc-list.component.scss']
})
export class UserHcListComponent implements OnInit {
  listUsers: UserHc[] = [];
  private unsubscribe = new Subject<void>();
  isLoading =  true;
  searchTerm: string;
  page: number = 1;
  collectionSize: number;
  PAGE_SIZE = DATATABLE_SETTINGS.PAGE_SIZE;
  errors: HttpErrorResponse;
  userId: number;

  constructor(
      private cdr: ChangeDetectorRef,
      private loopbackService: LoopbackService,
      private router: Router,
      private toastService: HotToastService,
  ) { }

  ngOnInit(): void {
    this.listUserHcs();
  }

  listUserHcs(): any {
    this.loopbackService
    .listUserHcs()
    .subscribe((response) => {
      console.log(response);
      this.listUsers = response;
      this.cdr.detectChanges();
    });
  }

  edit(userId: number): void {
    this.router
      .navigateByUrl(`/workers/${AppRoutes.USER_HC}/detail/${userId}`)
      .then();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
