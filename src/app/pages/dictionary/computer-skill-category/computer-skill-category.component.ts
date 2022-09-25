import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';

import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';
import { ComputerSkillCategory, Qualification } from 'src/app/core/models/loopback.model';
import { FormModel } from 'src/app/shared/FormModel';
import Swal from 'sweetalert2';
import { LoopbackService } from '../../../core/services/loopback.service';

@Component({
  selector: 'app-computer-skill-category',
  templateUrl: './computer-skill-category.component.html',
  styleUrls: ['./computer-skill-category.component.scss']
})
export class ComputerSkillCategoryComponent implements OnInit {
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;
  private unsubscribe = new Subject<void>();
  error = false;
  hasError: boolean;
  errors: HttpErrorResponse;
  errorMsg: string = '';
  computerSkillId: number;
  listcomputerSkillToEdit: ComputerSkillCategory;
  listcomputerSkill: ComputerSkillCategory[] = [];
  editMode = false;
  isNew = false;
  public computerSkilltionForm: FormGroup;

  private loadingSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  public loadingSubject$: Observable<boolean> =
    this.loadingSubject.asObservable();

  constructor(
    private cdr: ChangeDetectorRef,
    private loopbackService: LoopbackService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private toastService: HotToastService,
    private router: Router
  ) {
    this.loadingSubject.next(true);

    this.route.params
    .pipe(takeUntil(this.unsubscribe))
    .subscribe((params) => {
      if(params.id == 'new') {
        this.isNew = true;
      } else {
        this.computerSkillId = params.id;
      }
    })
  }

  ngOnInit(): void {
    this.loadListComputerSkillCategory();

    if(!this.isNew) {
      this.loopbackService
        .findComputerSkillCategoryById(this.computerSkillId)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((response) => {
          this. listcomputerSkillToEdit = response;
          this.buildForm();
        });
    } else {
        this.buildForm();
    }
  }

  buildForm() {
    const computerSkilltionFormModel: FormModel<Qualification> = {
      id: [this. listcomputerSkillToEdit ? this. listcomputerSkillToEdit.id : 1, Validators.required],
      name: [this. listcomputerSkillToEdit ? this. listcomputerSkillToEdit.name : '', Validators.required],
      isActive: [this. listcomputerSkillToEdit ? this. listcomputerSkillToEdit.isActive : 0, Validators.required],
    }

    this.computerSkilltionForm = this.fb.group(computerSkilltionFormModel);
    
    this.loadingSubject.next(false);
  }

  loadListComputerSkillCategory(): any {
    this.loopbackService
    .listComputerSkillCategories()
    .pipe(takeUntil(this.unsubscribe))
    .subscribe((response) => {
      this.cdr.detectChanges();
    });
  }

  reset(): void {
    Swal.fire({
      title: 'Biztos elveted a műveletet?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Igen',
      cancelButtonText: 'Nem'
    }).then((result) => {
      if (result.value) {
        this.computerSkilltionForm.reset();
        this.router.navigate(['/dictionary/computer-skills-category/list'])
            .then();
        this.buildForm();
      }
    })
  }

  saveSettings(): void {
    if (this.computerSkilltionForm.value) {

      this.computerSkilltionForm.controls['isActive'].value == true 
      ? this.computerSkilltionForm.controls['isActive'].setValue(1) 
      : this.computerSkilltionForm.controls['isActive'].setValue(0);

      const computerSkillCat: ComputerSkillCategory = {
        ...this.computerSkilltionForm.value,
      };

      this.loopbackService
      .saveComputerSkillCategory(computerSkillCat)
      .pipe(
        this.toastService.observe({
          loading: 'Folyamantban...',
          success: 'Sikeres mentés',
          error: 'Hiba történt'
       }),takeUntil(this.unsubscribe))
      .subscribe((response) => {
        this.computerSkilltionForm.markAllAsTouched();
        this.router.navigate(['/dictionary/computer-skills-category/list'])
        .then();
      },
      (error: HttpErrorResponse) => {
        this.errors = error;
      });
    } else {
      this.toastService.error('Error');
      this.computerSkilltionForm.markAllAsTouched();
    }
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
