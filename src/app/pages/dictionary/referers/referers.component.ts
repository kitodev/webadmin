import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';

import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';
import { Referers } from 'src/app/core/models/loopback.model';
import { LoopbackService } from 'src/app/core/services/loopback.service';
import { FormModel } from 'src/app/shared/FormModel';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-referers',
  templateUrl: './referers.component.html',
  styleUrls: ['./referers.component.scss']
})
export class ReferersComponent implements OnInit {

  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;
  private unsubscribe = new Subject<void>();
  error = false;
  hasError: boolean;
  errors: HttpErrorResponse;
  errorMsg: string = '';
  qualificationId: number;
  listQualificationToEdit: Referers;
  listQualification: Referers[] = [];
  editMode = false;
  isNew = false;
  public site: any[] = [];
  public qualificationForm: FormGroup;

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
        this.qualificationId = params.id;
      }
    })
  }

  ngOnInit(): void {
    this.loadListQualifications();

    if(!this.isNew) {
      this.loopbackService
        .findRefererById(this.qualificationId)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((response) => {
          this.listQualificationToEdit = response;
          this.buildForm();
        });
    } else {
        this.buildForm();
    }
  }

  buildForm() {
    const qualificationFormModel: FormModel<Referers> = {
      id: [this.listQualificationToEdit ? this.listQualificationToEdit.id : 0, Validators.required],
      name: [this.listQualificationToEdit ? this.listQualificationToEdit.name : '', Validators.required],
      site: [this.listQualificationToEdit ? this.listQualificationToEdit.site : 0, Validators.required],
      isActive: [this.listQualificationToEdit ? this.listQualificationToEdit.isActive : 0, Validators.required],
    }

    this.qualificationForm = this.fb.group(qualificationFormModel);
    const firstType = {
      id: 10,
      value: 'HC',
      name: 'Humáncentrum'
    };

    const secondType = {
      id: 20,
      value: 'MD',
      name: 'Minddiák'
    }

    const thirdType = {
      id: 30,
      value: 'HCMD',
      name: 'Humáncentrum és Minddiák'
    }

    this.site.push(firstType);
    this.site.push(secondType);
    this.site.push(thirdType);
    
    this.loadingSubject.next(false);
  }

  loadListQualifications(): any {
    this.loopbackService
    .listReferers()
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
        this.qualificationForm.reset();
        this.router.navigate(['/dictionary/referers/list'])
            .then();
        this.buildForm();
        }
      })
  }

  saveSettings(): void {
    if (this.qualificationForm.value) {

      this.qualificationForm.controls['isActive'].value == true 
      ? this.qualificationForm.controls['isActive'].setValue(1) 
      : this.qualificationForm.controls['isActive'].setValue(0);

      const qualification: Referers = {
        ...this.qualificationForm.value,
      };

      qualification.site = (qualification.site
        ? parseInt(qualification.site.toString(), 10) : 0);

      this.loopbackService
      .saveReferer(qualification)
      .pipe(
        this.toastService.observe({
          loading: 'Folyamantban...',
          success: 'Sikeres mentés',
          error: 'Hiba történt'
       }),takeUntil(this.unsubscribe))
      .subscribe((response) => {
        this.qualificationForm.markAllAsTouched();
        this.router.navigate(['/dictionary/referers/list'])
        .then();
      },
      (error: HttpErrorResponse) => {
        this.errors = error;
      });
    } else {
      this.toastService.error('Error');
      this.qualificationForm.markAllAsTouched();
    }
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
