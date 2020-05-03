import {Directive, ElementRef, Input, OnInit, TemplateRef, ViewContainerRef} from '@angular/core';
import {AuthService} from '../service/auth.service';
import {Permission} from '../model/permission.enum';

@Directive({
  selector: '[appPermission]'
})
export class PermissionDirective implements OnInit {

  @Input('appPermission') permissionAllow: Permission;
  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.checkPermission(this.permissionAllow).subscribe(allow => {
      if (allow) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      } else {
        this.viewContainer.clear();
      }
    });
  }

}
