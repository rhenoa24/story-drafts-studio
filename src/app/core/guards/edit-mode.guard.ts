import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { EditModeService } from '../services/edit-mode.service';

/** Redirects to /collections when Edit Mode is disabled (i.e. the deployed GitHub Pages site). */
export const editModeGuard: CanActivateFn = () => {
  const editMode = inject(EditModeService);
  if (editMode.isEditModeEnabled) return true;
  return inject(Router).createUrlTree(['/']);
};
