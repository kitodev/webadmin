import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';

import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';
import { EmailSubscriber } from 'src/app/core/models/loopback.model';
import { FormModel } from 'src/app/shared/FormModel';
import Swal from 'sweetalert2';
import { LoopbackService } from '../../../core/services/loopback.service';

@Component({
  selector: 'app-hc-subscriber',
  templateUrl: './hc-subscriber.component.html',
  styleUrls: ['./hc-subscriber.component.scss']
})
export class HCSubscriberComponent implements OnInit {
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;
  private unsubscribe = new Subject<void>();
  error = false;
  hasError: boolean;
  errors: HttpErrorResponse;
  errorMsg: string = '';
  emailSubscriberId: number;
  listEmailSubscriberToEdit: EmailSubscriber;
  listEmailSubscriber:  EmailSubscriber[] = [];
  editMode = false;
  isNew = false;
  public emailSubscriberForm: FormGroup;

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
        this.emailSubscriberId = params.id;
      }
    })
  }

  ngOnInit(): void {
    this.loadListEmailSubscribers();
    this.buildForm();
  }

  buildForm() {
    const emailSubscriberFormModel: FormModel<EmailSubscriber> = {
      id: [this.listEmailSubscriberToEdit ? this.listEmailSubscriberToEdit.id : 1, Validators.required],
      name: [this.listEmailSubscriberToEdit ? this.listEmailSubscriberToEdit.name : '', Validators.required],
      email: [this.listEmailSubscriberToEdit ? this.listEmailSubscriberToEdit.email : '', Validators.required],
      siteId: [this.listEmailSubscriberToEdit ? this.listEmailSubscriberToEdit.siteId : 'hc', Validators.required],
      //createTime: [this.listEmailSubscriberToEdit.createTime, Validators.required],
    }

    this.emailSubscriberForm = this.fb.group(emailSubscriberFormModel);
    
    this.loadingSubject.next(false);
  }

  loadListEmailSubscribers(): any {
    this.loopbackService
    .listEmailSubscriber()
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
        this.emailSubscriberForm.reset();
        this.router.navigate(['/email-subscriber/hc-subscriber/list'])
            .then();
        this.buildForm();
      }
    })
  }

  saveSettings(): void {
    if (this.emailSubscriberForm.value) {
      const emailSubscriber: EmailSubscriber = {
        ...this.emailSubscriberForm.value,
      };

      this.loopbackService
      .saveEmailSubscriber(emailSubscriber)
      .pipe(
        this.toastService.observe({
          loading: 'Folyamantban...',
          success: 'Sikeres mentés',
          error: 'Hiba történt'
       }),takeUntil(this.unsubscribe))
      .subscribe((response) => {
        this.emailSubscriberForm.markAllAsTouched();
        this.router.navigate(['/email-subscriber/hc-subscriber/list'])
        .then();
      },
      (error: HttpErrorResponse) => {
        this.errors = error;
      });
    } else {
      this.toastService.error('Error');
      this.emailSubscriberForm.markAllAsTouched();
    }
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
