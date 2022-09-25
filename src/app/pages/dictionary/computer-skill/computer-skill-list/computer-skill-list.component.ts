import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { DATATABLE_SETTINGS } from 'src/app/constants';
import { ComputerSkill, ComputerSkillCategory, DrivingLicence } from 'src/app/core/models/loopback.model';
import { AppRoutes } from 'src/app/shared/system/AppRoutes';
import Swal from 'sweetalert2';
import { LoopbackService } from '../../../../core/services/loopback.service';

@Component({
  selector: 'app-computer-skill-list',
  templateUrl: './computer-skill-list.component.html',
  styleUrls: ['./computer-skill-list.component.scss']
})
export class ComputerSkillListComponent implements OnInit {
  private loadingSubject: BehaviorSubject<boolean> =
  new BehaviorSubject<boolean>(false);
  
  private unsubscribe = new Subject<void>();
  PAGE_SIZE = DATATABLE_SETTINGS.PAGE_SIZE;
  computerSkillId: number;
  listComputerSkill: ComputerSkill[] = [];
  listComputerSkillCategories: ComputerSkillCategory[] = [];
  isLoading =  true;
  errors: HttpErrorResponse;
  countComputerSkill: number[];
  searchTerm: string;
  page: number = 1;
  collectionSize: number;
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
    this.listComputerSkillsCategories();
    this.listComputerSkills();
    this.countComputerSkills();
    this.loadStatus();
    this.loadTableColumns();
  }
  
  countComputerSkills(): any {
    this.loopbackService
    .countComputerSkill()
    .subscribe((response) => {
      this.countComputerSkill = response.count;
      this.cdr.detectChanges();
    });
  }

  listComputerSkills(): any {
    this.loopbackService
    .listComputerSkills(this.computerSkillId)
    .subscribe((response) => {
      this.listComputerSkill = response;
      this.cdr.detectChanges();
    });
  }

  listComputerSkillsCategories(): any {
    this.loopbackService
    .listComputerSkillCategories()
    .subscribe((response) => {
      this.listComputerSkillCategories = response;
      this.cdr.detectChanges();
    });
  }

  loadTableColumns(): any {
    this.cols = [
      { field: 'name', header: 'Megnevezés' },
      { field: 'computerSkillCategoryId', header: 'Kategória' },
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

  delete(computerSkillId: number): void {
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
              .deleteComputerSkill(computerSkillId)
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
                this.listComputerSkills();
              },
              (error: HttpErrorResponse) => {
                this.errors = error;
              });  
        }
      })
  }

  edit(computerSkillId: number): void {
    this.router
      .navigateByUrl(`${AppRoutes.DICTIONARY}/${AppRoutes.COMPUTER_SKILLS}/detail/${computerSkillId}`)
      .then();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
