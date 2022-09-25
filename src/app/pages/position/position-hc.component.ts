import { PositionHcs } from './../../core/models/loopback.model';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';

import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';
import { Positions } from 'src/app/core/models/loopback.model';
import { FormModel } from 'src/app/shared/FormModel';
import Swal from 'sweetalert2';
import { LoopbackService } from '../../core/services/loopback.service';

@Component({
  selector: 'app-position',
  templateUrl: './position-hc.component.html',
  styleUrls: ['./position-hc.component.scss']
})
export class PositionHcComponent implements OnInit {
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;
  private unsubscribe = new Subject<void>();
  error = false;
  hasError: boolean;
  errors: HttpErrorResponse;
  errorMsg: string = '';
  positionId: number;
  tagCategoryId: number;
  listPositionId: number;
  positionHcToEdit: PositionHcs;
  listPositionToEdit: Positions;
  listPosition: Positions[] = [];
  editMode = false;
  isNew = false;
  public positionForm: FormGroup;
  //public positionHcFormModel: FormGroup;
  // public categories: any[] = [];
  //public types: any[] = [];
  public serviceId: any[] = [];
  public officeId: any[] = [];

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
        console.log(params.id);
        this.isNew = true;
      } else {
        this.positionId = params.id;
      }
    })
  }

  ngOnInit(): void {
    this.loadListPosition();

    if(!this.isNew) {
      this.loopbackService
        .findPositionsById(this.positionId)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((response) => {
          this.listPositionToEdit = response;
          this.buildForm();
        });
    } else {
        this.buildForm();
    }
  }

  buildForm() {
    // const pairHcFormModel: Array<FormGroup> = [];
    // this.listPositionToEdit.positionHc.forEach((pair) => {
    //   pairHcFormModel.push(
    //     this.fb.group({
    //       positionId: [pair.positionId ? pair.positionId : 0, Validators.required],
    //       ageMin: [pair.ageMin ? pair.ageMin : 0, Validators.nullValidator],
    //       ageMax: [pair.ageMax ? pair.ageMax : 0, Validators.nullValidator],
    //       employmentStatus: [pair.employmentStatus ? pair.employmentStatus : 0, Validators.nullValidator],
    //       workOrder: [pair.workOrder ? pair.workOrder : 0, Validators.nullValidator],
    //       workTimeType: [pair.workTimeType ? pair.workTimeType : 0, Validators.nullValidator],
    //     })
    //   );
    // });
    // const pairpositionTagsFormModel: Array<FormGroup> = [];
    // this.listPositionToEdit.positionTags.forEach((pair) => {
    //     pairpositionTagsFormModel.push(
    //       this.fb.group({
    //         tag_id: [pair.tag_id ? pair.tag_id : 0, Validators.required],
    //         })
    //     );
    // });
    // const pairpositionLangFormModel: Array<FormGroup> = [];
    // this.listPositionToEdit.positionLanguages.forEach((pair) => {
    //     pairpositionLangFormModel.push(
    //       this.fb.group({
    //         languageId: [pair.languageId ? pair.languageId : 0, Validators.required],
    //         spokenLevel: [pair.spokenLevel ? pair.spokenLevel : 0, Validators.required],
    //         writtenLevel: [pair.writtenLevel ? pair.writtenLevel : 0, Validators.required],
    //       })
    //     );
    // });
    // const pairpositionCompSkillsFormModel: Array<FormGroup> = [];
    //   this.listPositionToEdit.positionComputerSkills.forEach((pair) => {
    //     pairpositionCompSkillsFormModel.push(
    //         this.fb.group({
    //           computerSkillId: [pair.computerSkillId ? pair.computerSkillId : 0, Validators.required],
    //           computerSkillCategoryId: [pair.computerSkillCategoryId ? pair.computerSkillCategoryId : 0, Validators.required],
    //           level: [pair.level ? pair.level : 0, Validators.required],
    //         })
    //       );
    // });
    // const pairpositionDrivingLicencessFormModel: Array<FormGroup> = [];
    //   this.listPositionToEdit.positionDrivingLicences.forEach((pair) => {
    //       pairpositionLangFormModel.push(
    //         this.fb.group({
    //           drivingLicenceId: [pair.drivingLicenceId ? pair.drivingLicenceId : 0, Validators.required],
    //          })
    //       );
    // });
    // const pairpositionQualificationsFormModel: Array<FormGroup> = [];
    //   this.listPositionToEdit.positionQualifications.forEach((pair) => {
    //       pairpositionLangFormModel.push(
    //         this.fb.group({
    //           qualificationId: [pair.qualificationId ? pair.qualificationId : 0, Validators.required],
    //           fieldsOfStudyCategoryId: [pair.fieldsOfStudyCategoryId ? pair.fieldsOfStudyCategoryId : 0, Validators.required],
    //           fieldsOfStudyId: [pair.fieldsOfStudyId ? pair.fieldsOfStudyId : 0, Validators.required],
    //         })
    //       );
    // });
    const positionFormModel: FormModel<Positions> = {
      id: [this.listPositionToEdit ? this.listPositionToEdit.id : 0, Validators.required],
      status: [this.listPositionToEdit ? this.listPositionToEdit.status : 0, Validators.nullValidator], 
      name: [this.listPositionToEdit ? this.listPositionToEdit.name : '', Validators.required],
      serviceId: [this.listPositionToEdit ? this.listPositionToEdit.serviceId : 0, Validators.required],
      officeId: [this.listPositionToEdit ? this.listPositionToEdit.officeId : 0, Validators.required],
      headcount: [this.listPositionToEdit ? this.listPositionToEdit.headcount : 0, Validators.nullValidator],
      companyId: [this.listPositionToEdit ? this.listPositionToEdit.companyId : 0, Validators.required],
      isPublished: [this.listPositionToEdit ? this.listPositionToEdit.isPublished : 0, Validators.required],
      requirements: [this.listPositionToEdit ? this.listPositionToEdit.requirements : '', Validators.required],
      advantages: [this.listPositionToEdit ? this.listPositionToEdit.advantages : '', Validators.required],
      isNewsletterSent: [this.listPositionToEdit ? this.listPositionToEdit.isNewsletterSent : 0, Validators.required],
      simpleApplicationAllowed: [this.listPositionToEdit ? this.listPositionToEdit.simpleApplicationAllowed : 0, Validators.required],
      ownerUserId: [this.listPositionToEdit ? this.listPositionToEdit.ownerUserId : 0, Validators.required],
      shortDescription: [this.listPositionToEdit ? this.listPositionToEdit.shortDescription : '', Validators.required],
      companyDescription: [this.listPositionToEdit ? this.listPositionToEdit.companyDescription : '', Validators.required],
      nameMayAppear: [this.listPositionToEdit ? this.listPositionToEdit.nameMayAppear : 0, Validators.required],
      description: [this.listPositionToEdit ? this.listPositionToEdit.description : '', Validators.nullValidator],
      zip: [this.listPositionToEdit ? this.listPositionToEdit.zip : '', Validators.required],
      countyId: [this.listPositionToEdit ? this.listPositionToEdit.countyId : 0, Validators.required],
      cityText: [this.listPositionToEdit ? this.listPositionToEdit.cityText : '', Validators.required],
      type: [this.listPositionToEdit ? this.listPositionToEdit.type : 0, Validators.required],
      //positionHc: this.fb.array(pairHcFormModel),
      fieldsOfWorkId: [this.listPositionToEdit ? this.listPositionToEdit.fieldsOfWorkId : 0, Validators.nullValidator],
      fieldsOfWorkCategoryId: [this.listPositionToEdit ? this.listPositionToEdit.fieldsOfWorkCategoryId : 0, Validators.nullValidator],
      // positionTags: this.fb.array(pairpositionTagsFormModel),
      // positionLanguages: this.fb.array(pairpositionLangFormModel),
      // positionComputerSkills: this.fb.array(pairpositionCompSkillsFormModel),
      // positionDrivingLicences: this.fb.array(pairpositionDrivingLicencessFormModel),
      // positionQualifications: this.fb.array(pairpositionQualificationsFormModel),
    }

    this.positionForm = this.fb.group(positionFormModel);
    console.log(this.positionForm);
    this.loadingSubject.next(false);


    // this.loopbackService
    // .listTagCategories()
    // .subscribe((res: any) => {
    //   res.forEach((element: any) => {
    //     this.categories.push(element);

    //     if(res && element) {
    //       this.loadingSubject.next(false);
    //     }
    //   });
    // });
  }

  loadListPosition(): any {
    this.loopbackService
    .listPositions()
    .pipe(takeUntil(this.unsubscribe))
    .subscribe((response) => {
      console.log(response);
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
        this.positionForm.reset();
        this.router.navigate(['/offices/list'])
        .then();
        this.buildForm();
      }
    })
  }

  saveSettings(): void {
    if (this.positionForm.value) {

      this.positionForm.controls['isActive'].value == true 
      ? this.positionForm.controls['isActive'].setValue(1) 
      : this.positionForm.controls['isActive'].setValue(0);

      this.positionForm.controls['isHc'].value == true 
      ? this.positionForm.controls['isHc'].setValue(1) 
      : this.positionForm.controls['isHc'].setValue(0);
      
      this.positionForm.controls['isMd'].value == true 
      ? this.positionForm.controls['isMd'].setValue(1) 
      : this.positionForm.controls['isMd'].setValue(0);

      const position: Positions = {
        ...this.positionForm.value,
      };

      position.type = (position.type
      ? parseInt(position.type.toString(), 10) : 0);

      this.loopbackService
      .savePositions(position)
      .pipe(
        this.toastService.observe({
          loading: 'Folyamantban...',
          success: 'Sikeres mentés',
          error: 'Hiba történt'
       }),takeUntil(this.unsubscribe))
      .subscribe((response) => {
        this.positionForm.markAllAsTouched();
        this.router.navigate(['/position-hc/list'])
        .then();
      },
      (error: HttpErrorResponse) => {
        this.errors = error;
      });
    } else {
      this.toastService.error('Error');
      this.positionForm.markAllAsTouched();
    }
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
