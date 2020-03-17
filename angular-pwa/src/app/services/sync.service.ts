import { Injectable } from '@angular/core';
import { OfflineService } from './offline.service';
import { ApiService } from './api.service';

@Injectable({
    providedIn: 'root'

})
export class SyncService {

    constructor(private offlineService: OfflineService,
                private apiService: ApiService) {
        this.initSyncTodos();
    }

    initSyncTodos() {
        setTimeout(() => {
            this.syncTodo();
            console.log('asf');
        }, 5000);
    }

    syncTodo() {
        if (this.offlineService.isOnline) {
            // this.getAllTodos();
        }
    }
}