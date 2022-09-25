import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';

import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';
import { ComputerSkill } from 'src/app/core/models/loopback.model';
import { FormModel } from 'src/app/shared/FormModel';
import Swal from 'sweetalert2';
import { LoopbackService } from '../../../core/services/loopback.service';

@Component({
  selector: 'app-computer-skill',
  templateUrl: './computer-skill.component.html',
  styleUrls: ['./computer-skill.component.scss']
})
export class ComputerSkillComponent implements OnInit {
  
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: Observable<boolean>;
  private unsubscribe = new Subject<void>();
  error = false;
  hasError: boolean;
  errors: HttpErrorResponse;
  errorMsg: string = '';
  computerSkillId: number;
  listComputerSkillToEdit: ComputerSkill;
  listComputerSkill: ComputerSkill[] = [];
  editMode = false;
  isNew = false;
  public computerSkillForm: FormGroup;
  public computerSkilltype: any[] = [];

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
    this.loadlistCity();

    if(!this.isNew) {
      this.loopbackService
        .findComputerSkillById(this.computerSkillId)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((response) => {
          this.listComputerSkillToEdit = response;
          this.buildForm();
        });
    } else {
        this.buildForm();
    }
  }

  buildForm() {
    const computerSkillFormModel: FormModel<ComputerSkill> = {
      id: [this.listComputerSkillToEdit ? this.listComputerSkillToEdit.id : 0, Validators.required],
      computerSkillCategoryId: [this.listComputerSkillToEdit ? this.listComputerSkillToEdit.computerSkillCategoryId : 0, Validators.required],
      name: [this.listComputerSkillToEdit ? this.listComputerSkillToEdit.name : '', Validators.required],
      isActive: [this.listComputerSkillToEdit ? this.listComputerSkillToEdit.isActive : 0, Validators.required],
    }

    this.computerSkillForm = this.fb.group(computerSkillFormModel);
    
    this.loopbackService
    .listComputerSkillCategories()
    .subscribe((res: any) => {
      res.forEach((element: any) => {
        this.computerSkilltype.push(element);

        if(res && element) {
          this.loadingSubject.next(false);
        }
      });
    });
  }

  loadlistCity(): any {
    this.loopbackService
    .listComputerSkills()
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
        this.computerSkillForm.reset();
        this.router.navigate(['/computer-skills/list'])
            .then();
        this.buildForm();
      }
    })
  }

  saveSettings(): void {
    if (this.computerSkillForm.value) {

      this.computerSkillForm.controls['isActive'].value == true 
      ? this.computerSkillForm.controls['isActive'].setValue(1) 
      : this.computerSkillForm.controls['isActive'].setValue(0);

      const computerSkill: ComputerSkill = {
        ...this.computerSkillForm.value,
      };

      this.loopbackService
      .saveComputerSkill(computerSkill)
      .pipe(
        this.toastService.observe({
          loading: 'Folyamantban...',
          success: 'Sikeres mentés',
          error: 'Hiba történt'
       }),takeUntil(this.unsubscribe))
      .subscribe((response) => {
        this.computerSkillForm.markAllAsTouched();
        this.router.navigate(['/dictionary/computer-skills/list'])
        .then();
      },
      (error: HttpErrorResponse) => {
        this.errors = error;
      });
    } else {
      this.toastService.error('Error');
      this.computerSkillForm.markAllAsTouched();
    }
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
