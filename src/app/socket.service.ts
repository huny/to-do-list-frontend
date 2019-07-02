import { Injectable } from '@angular/core';

import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Cookie } from 'ng2-cookies/ng2-cookies';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse, HttpParams } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private url = 'http://api.youwecan.xyz';

  private socket;

  constructor(public http: HttpClient) {
    // connection is being created.
    this.socket = io(this.url);
  }

  //events to be listened

  public verifyUser = () => {

    return Observable.create((observer) => {

      this.socket.on('verifyUser', (data) => {

        observer.next(data);

      }); // end Socket

    }); // end Observable

  } // end verifyUser

  public onAuthError = () => {

    return Observable.create((observer) => {

      this.socket.on('auth-error', (data) => {

        observer.next(data);

      }); // end Socket

    }); // end Observable

  } // end onAuthError

  public onReceivedRequest = () => {

    return Observable.create((observer) => {

      this.socket.on(`request-recieved-${Cookie.get('userId')}`, (data) => {

        observer.next(data);

      }); // end Socket

    }); // end Observable

  } // end onReceiveRequest

  public onAcceptedRequest = () => {

    return Observable.create((observer) => {

      this.socket.on(`request-accepted-${Cookie.get('userId')}`, (data) => {

        observer.next(data);

      }); // end Socket

    }); // end Observable

  } // end onAcceptedRequest

  public onCancelledRequest = () => {

    return Observable.create((observer) => {

      this.socket.on(`request-cancelled-${Cookie.get('userId')}`, (data) => {

        observer.next(data);

      }); // end Socket

    }); // end Observable

  } // end onRejectedRequest

  public onToDoListCreated = () => {

    return Observable.create((observer) => {

      this.socket.on(`to-do-list-created-${Cookie.get('userId')}`, (data) => {

        observer.next(data);

      }); // end Socket

    }); // end Observable

  } // end onToDoListCreated

  public onToDoItemAdded = () => {

    return Observable.create((observer) => {

      this.socket.on(`to-do-item-added-${Cookie.get('userId')}`, (data) => {

        observer.next(data);

      }); // end Socket

    }); // end Observable

  } // end onToDoItemAdded

  public onToDoItemEdited = () => {

    return Observable.create((observer) => {

      this.socket.on(`to-do-item-edited-${Cookie.get('userId')}`, (data) => {

        observer.next(data);

      }); // end Socket

    }); // end Observable

  } // end onToDoItemEdited

  public onToDoItemDeleted = () => {

    return Observable.create((observer) => {

      this.socket.on(`to-do-item-deleted-${Cookie.get('userId')}`, (data) => {

        observer.next(data);

      }); // end Socket

    }); // end Observable

  } // end onToDoItemDeleted

  public onItemStatusChanged = () => {

    return Observable.create((observer) => {

      this.socket.on(`item-status-changed-${Cookie.get('userId')}`, (data) => {

        observer.next(data);

      }); // end Socket

    }); // end Observable

  } // end onToDoItemDeleted

  public onToDoListDeleted = () => {

    return Observable.create((observer) => {

      this.socket.on(`to-do-list-deleted-${Cookie.get('userId')}`, (data) => {

        observer.next(data);

      }); // end Socket

    }); // end Observable

  } // end onToDoListDeleted

  public onActionUndone = () => {

    return Observable.create((observer) => {

      this.socket.on(`action-undone-${Cookie.get('userId')}`, (data) => {

        observer.next(data);

      }); // end Socket

    }); // end Observable

  } // end onActionUndone

  //end events to be listened

  //events to be emitted

  public setUser = (authToken) => {

    this.socket.emit("set-user", authToken);

  } // end setUser

  public emitSendRequest = (request) => {
    this.socket.emit("send-request", request);
  }//end emitSendRequest

  public emitAcceptRequest = (request) => {
    this.socket.emit("accept-request", request);
  }//end emitSendRequest

  public emitCancelRequest = (request) => {
    this.socket.emit("cancel-request", request);
  }//end emitSendRequest

  public emitCreateToDoList = (list, userId, modifiedBy) => {
    this.socket.emit("create-to-do-list", list, userId, modifiedBy);
  }//end emitCreateToDoList

  public emitAddToDoItem = (details, userId, modifiedBy) => {
    this.socket.emit("add-to-do-item", details, userId, modifiedBy);
  }//end emitAddToDoItem

  public emitEditToDoItem = (details, userId, modifiedBy) => {
    this.socket.emit("edit-to-do-item", details, userId, modifiedBy);
  }//end emitEditToDoItem

  public emitDeleteToDoItem = (details, userId, modifiedBy) => {
    this.socket.emit("delete-to-do-item", details, userId, modifiedBy);
  }//end emitDeleteToDoItem

  public emitChangeStatusOfItem = (details, userId, modifiedBy) => {
    this.socket.emit("change-status-of-item", details, userId, modifiedBy);
  }//end emitChangeStatusOfItem

  public emitDeleteToDoList = (details) => {
    this.socket.emit("delete-to-do-list", details);
  }//end emitDeleteToDoList

  public emitUndoAction = (details) => {
    this.socket.emit("undo-action", details);
  }//end emitUndoActionsssss

  //end events to be emitted

  public exitSocket = () => {
    this.socket.disconnect();
  }// end exit socket

  private handleError(err: HttpErrorResponse) {

    let errorMessage = '';

    if (err.error instanceof Error) {

      errorMessage = `An error occurred: ${err.error.message}`;

    } else {

      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;

    } // end condition *if

    return Observable.throw(errorMessage);

  }  // END handleError
}
