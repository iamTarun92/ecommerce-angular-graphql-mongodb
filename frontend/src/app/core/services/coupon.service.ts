import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class CouponService {

    isCouponValid(sDate: string, eDate: string): boolean {
        const currentDate = new Date();
        const startDate = new Date(sDate);
        const endDate = new Date(eDate);
        return startDate <= currentDate && endDate >= currentDate;
    }
}
