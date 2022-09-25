import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { DATATABLE_SETTINGS } from 'src/app/constants';
import { ComputerSkillCategory } from 'src/app/core/models/loopback.model';
import { AppRoutes } from 'src/app/shared/system/AppRoutes';
import Swal from 'sweetalert2';
import { LoopbackService } from '../../../../core/services/loopback.service';

@Component({
  selector: 'app-computer-skill-category-list',
  templateUrl: './computer-skill-category-list.component.html',
  styleUrls: ['./computer-skill-category-list.component.scss']
})
export class ComputerSkillCategoryListComponent implements OnInit {
  private loadingSubject: BehaviorSubject<boolean> =
  new BehaviorSubject<boolean>(false);
  
  private unsubscribe = new Subject<void>();
  PAGE_SIZE = DATATABLE_SETTINGS.PAGE_SIZE;
  listcomputerSkillCategory: ComputerSkillCategory[] = [];
  listcomputerSkillCategoryId: number;
  isLoading = true;
  errors: HttpErrorResponse;
  countComputerFieldsOfCat: number;
  searchTerm: string;
  page: number = 1;
  collectionSize: number;
  listActive: any[] = [];
  cols: any[] = [];
  
  constructor(
      private cdr: ChangeDetectorRef,
      private loopbackService: LoopbackService,
      private router: Router,
      private toastService: HotToastService,
      private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.listComputerFieldsOfCategories();
    this.countComputerFieldsOfCategories();
    this.loadStatus();
    this.loadTableColumns();
  }
  
  countComputerFieldsOfCategories(): any {
      this.loopbackService
      .countFieldsOfStudyCategories()
      .subscribe((response) => {
        console.log(response);
        this.countComputerFieldsOfCat = response.count;
        this.cdr.detectChanges();
    });
  }

  listComputerFieldsOfCategories(): any {
    this.loopbackService
    .listComputerSkillCategories()
    .subscribe((response) => {
      this. listcomputerSkillCategory = response;
      this.cdr.detectChanges();
    });
  }

  loadTableColumns(): any {
    this.cols = [
      { field: 'name', header: 'Megnevezés' },
      { field: 'isActive', header: '' },
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

  delete(computerSkillCategoryId: number): void {
      Swal.fire({
        title: 'Biztos törlöd ezt az elemet?',
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
              .deleteComputerSkillCategory(computerSkillCategoryId)
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
                this.listComputerFieldsOfCategories();
              },
              (error: HttpErrorResponse) => {
                this.errors = error;
              });  
        }
      })
  }

  edit(computerSkillCategoryId: number): void {
    this.router
      .navigateByUrl(`${AppRoutes.DICTIONARY}/${AppRoutes.COMPUTER_SKILLS_CATEGORY}/detail/${computerSkillCategoryId}`)
      .then();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
