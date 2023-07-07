import { ErrorHandler, Injectable } from "@angular/core";
import { MyMonitoringService } from "./logging.service";

@Injectable()
export class ErrorHandlerService extends Error {

    constructor(private myMonitoringService: MyMonitoringService) {
        super();
    }

     handleError(error: Error) {
        this.myMonitoringService.logException(error); // Manually log exception
    }
}