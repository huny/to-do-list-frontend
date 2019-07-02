import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppService } from './../../app.service';
import { ToastrService } from 'ngx-toastr';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { SocketService } from './../../socket.service';
import { NgxSmartModalService } from 'ngx-smart-modal';

@Component({
  selector: 'app-to-do-list',
  host: {
    '(window:keydown)': 'undoUsingKeypress($event)'
  },
  templateUrl: './to-do-list.component.html',
  styleUrls: ['./to-do-list.component.css']
})
export class ToDoListComponent implements OnInit {

  public authToken: any;
  public userInfo: any;
  public userId: any;
  public userName: any;
  public friendList: any = [];
  public friendRequests: any = [];
  public onlineUserList: any = [];
  public nonFriendList: any = [];
  public disconnectedSocket: boolean;
  public toDoLists: any = [];
  public toDoItems: any = [];
  public listUserId: any;
  public listUserName: any;
  public newListName: any;
  public newItemName: any;
  public addItemName: any;
  public currentListId: any;

  constructor(
    public appService: AppService,
    public toastr: ToastrService,
    public router: Router,
    public socketService: SocketService,
    public ngxSmartModalService: NgxSmartModalService
  ) { }

  ngOnInit() {

    this.authToken = Cookie.get('authToken');
    this.userId = Cookie.get('userId');
    this.userName = Cookie.get('userName');
    this.userInfo = this.appService.getUserInfoFromLocalstorage();

    this.verifyUserConfirmation();
    this.handleAuthentictionError();
    this.onReceivedRequest();
    this.onAcceptedRequest();
    this.onCancelledRequest();
    this.onToDoListCreated();
    this.onToDoItemAdded();
    this.onToDoItemEdited();
    this.onToDoItemDeleted();
    this.onItemStatusChanged();
    this.onToDoListDeleted();
    this.onActionUndone();
    this.getPeopleYouMayKnow();
    this.getAllFriendRequests();
    this.getAllFriends();
    this.getAllLists(Cookie.get('userId'), this.userInfo.userName);

  }//end ngOnInit

  public getPeopleYouMayKnow: any = () => {
    this.appService.getPeopleYouMayKnow(this.userInfo.userId)
      .subscribe((apiResponse) => {
        if (apiResponse.status === 200) {
          this.nonFriendList = apiResponse.data;
        } else {
          this.nonFriendList = [];
        }
      })
  }//end getPeopleYouMayKnow

  public getAllFriendRequests: any = () => {
    this.appService.getAllFriendRequests(this.userInfo.userId)
      .subscribe((apiResponse) => {
        if (apiResponse.status === 200) {
          this.friendRequests = apiResponse.data;
        } else {
          this.friendRequests = [];
        }
      })
  }//end getAllFriendRequests

  public getAllFriends: any = () => {
    this.appService.getUserById(this.userInfo.userId)
      .subscribe((apiResponse) => {
        if (apiResponse.status === 200) {
          this.friendList = apiResponse.data.friends;
        } else {
          this.friendList = [];
        }
      })
  }//end getAllFriends

  public sendFriendRequest: any = (recipientId, recipientName) => {

    let requestData = {
      requesterId: this.userInfo.userId,
      requesterName: this.userInfo.userName,
      recipientId: recipientId,
      recipientName: recipientName
    }
    this.appService.sendFriendRequest(requestData)
      .subscribe((apiResponse) => {
        if (apiResponse.status === 200) {
          this.toastr.success('Friend request sent.');
          this.getPeopleYouMayKnow();
          this.socketService.emitSendRequest(apiResponse.data);
        }
      })
  }//end sendFriendRequest

  public acceptFriendRequest: any = (requesterId, requesterName) => {
    let requestData = {
      userId: this.userInfo.userId,
      userName: this.userInfo.userName,
      requesterId: requesterId,
      requesterName: requesterName
    }
    this.appService.acceptFriendRequest(requestData)
      .subscribe((apiResponse) => {
        if (apiResponse.status === 200) {
          this.toastr.success('Friend request accepted');
          this.getAllFriendRequests();
          this.getAllFriends();
          this.socketService.emitAcceptRequest(apiResponse.data)
        } else {
          this.toastr.error(apiResponse.message)
        }
      })
  }//end acceptFriendRequest

  public rejectFriendRequest: any = (requesterId) => {
    let requestData = {
      userId: this.userInfo.userId,
      requesterId: requesterId
    }
    this.appService.rejectFriendRequest(requestData)
      .subscribe((apiResponse) => {
        if (apiResponse.status === 200) {
          this.toastr.success('Friend request rejected');
          this.getPeopleYouMayKnow();
          this.getAllFriendRequests();
          this.socketService.emitCancelRequest(apiResponse.data);
        } else {
          this.toastr.error(apiResponse.message)
        }
      })
  }//end rejectFriendRequest

  public verifyUserConfirmation: any = () => {

    this.socketService.verifyUser()
      .subscribe(() => {

        this.disconnectedSocket = false;

        this.socketService.setUser(this.authToken);

      });
  }//end verifyUserConfirmation

  public handleAuthentictionError: any = () => {

    this.socketService.onAuthError()
      .subscribe(() => {

        this.toastr.error('Invalid or expired authentication key');
        this.router.navigate(['/login'])

      });
  }//end handleAuthentictionError

  public onReceivedRequest: any = () => {

    this.socketService.onReceivedRequest()
      .subscribe((request) => {
        console.log(request)
        this.toastr.info(`${request.requesterName} sent you a friend request.`)
        this.getPeopleYouMayKnow();
        this.getAllFriendRequests();

      });
  }//end onReceivedRequest

  public onAcceptedRequest: any = () => {

    this.socketService.onAcceptedRequest()
      .subscribe((request) => {

        this.toastr.info(`${request.recipientName} accepted your friend request.`);
        this.getAllFriends();

      });
  }//end onAcceptedRequest

  public onCancelledRequest: any = () => {

    this.socketService.onCancelledRequest()
      .subscribe((request) => {

        this.toastr.info(`${request.recipientName} rejected your friend request.`)
        this.getPeopleYouMayKnow();

      });
  }//end onCancelledRequest

  public onToDoListCreated: any = () => {

    this.socketService.onToDoListCreated()
      .subscribe((list) => {

        this.toastr.info(`A new list is created by ${list.createdBy}`);
        this.getAllLists(this.listUserId, this.listUserName);
        this.currentListId = list.listId;

      });
  }//end onToDoListCreated

  public onToDoItemAdded: any = () => {

    this.socketService.onToDoItemAdded()
      .subscribe((result) => {

        this.toastr.info(`A to-do-item is added by ${result.modifiedBy}`);
        this.getAllLists(this.listUserId, this.listUserName);
        this.currentListId = result.listId;

      });
  }//end onToDoItemAdded

  public onToDoItemEdited: any = () => {

    this.socketService.onToDoItemEdited()
      .subscribe((result) => {

        this.toastr.info(`A to-do-item is updated by ${result.modifiedBy}`);
        this.getAllLists(this.listUserId, this.listUserName);
        this.currentListId = result.listId;
      });
  }//end onToDoItemEdited

  public onToDoItemDeleted: any = () => {

    this.socketService.onToDoItemDeleted()
      .subscribe((result) => {

        this.toastr.info(`A to-do-item is deleted by ${result.modifiedBy}`);
        this.getAllLists(this.listUserId, this.listUserName);
        this.currentListId = result.listId;

      });
  }//end onToDoItemDeleted

  public onItemStatusChanged: any = () => {

    this.socketService.onItemStatusChanged()
      .subscribe((result) => {

        this.toastr.info(`A to-do-item state is changed by ${result.modifiedBy}`);
        this.getAllLists(this.listUserId, this.listUserName);
        this.currentListId = result.listId;

      });
  }//end onItemStatusChanged

  public onToDoListDeleted: any = () => {

    this.socketService.onToDoListDeleted()
      .subscribe((details) => {

        this.toastr.info(`A to-do-list is deleted by ${details.modifiedBy}`);
        this.getAllLists(this.listUserId, this.listUserName);
        this.currentListId = details.listId;

      });
  }//end onToDoListDeleted

  public onActionUndone: any = () => {

    this.socketService.onActionUndone()
      .subscribe((details) => {

        this.toastr.info(`Some action has been undone by ${details.modifiedBy}`);
        this.getAllLists(this.listUserId, this.listUserName);

      });
  }//end onActionUndone

  public createNewList: any = () => {

    if (!this.newListName) {
      this.toastr.warning('please enter a list name');
    } else {

      let listData = {
        userId: this.listUserId,
        listName: this.newListName,
        loggedOnUser: this.userName
      }

      this.appService.createNewList(listData)
        .subscribe((apiResponse) => {
          if (apiResponse.status === 200) {
            this.getAllLists(this.listUserId, this.listUserName);
            this.socketService.emitCreateToDoList(apiResponse.data, this.userId, this.userName)
            this.newListName = "";
            this.currentListId = apiResponse.data.listId;
          } else {
            this.toastr.error(apiResponse.message)
          }
        })
    }
  }//end createNewList

  public addToDoItem: any = (listId, parentId) => {
    if (!this.addItemName) {
      this.toastr.warning('Please enter item name')
    } else {
      this.ngxSmartModalService.getModal('addItemModal').close();
      this.ngxSmartModalService.getModal('myModal').close();
      let data = {
        listId: listId,
        parentId: parentId,
        itemName: this.addItemName,
        loggedOnUser: this.userName
      }

      this.appService.addToDoItem(data)
        .subscribe((apiResponse) => {
          if (apiResponse.status === 200) {
            this.toastr.success('Item added successfully');
            this.getAllLists(this.listUserId, this.listUserName);
            this.socketService.emitAddToDoItem(apiResponse.data, this.userId, this.userName);
            this.addItemName = "";
            this.newItemName = "";
            this.currentListId = apiResponse.data.listDetails.listId;
          } else {
            this.toastr.error(apiResponse.message);
          }
        })
    }
  }//end addToDoItem

  public editToDoItem: any = (itemId, itemName) => {
    if (!this.newItemName) {
      this.toastr.warning('Please enter item name');
    } else if (this.newItemName === itemName) {
      this.toastr.warning('Nothing to update')
    } else {
      this.ngxSmartModalService.getModal('myModal').close();
      let data = {
        itemId: itemId,
        itemName: this.newItemName,
        loggedOnUser: this.userName
      }

      this.appService.editToDoItem(data)
        .subscribe((apiResponse) => {
          if (apiResponse.status === 200) {
            this.toastr.success('Item updated successfully');
            this.getAllLists(this.listUserId, this.listUserName);
            this.socketService.emitEditToDoItem(apiResponse.data, this.userId, this.userName);
            this.newItemName = "";
            this.currentListId = apiResponse.data.listDetails.listId;
          } else {
            this.toastr.error(apiResponse.message);
          }
        })
    }
  }//end editToDoItem

  public deleteToDoItem: any = (itemId, listId) => {
    this.ngxSmartModalService.getModal('myModal').close();
    let data = {
      itemId: itemId,
      listId: listId,
      loggedOnUser: this.userName
    }

    this.appService.deleteToDoItem(data)
      .subscribe((apiResponse) => {
        if (apiResponse.status === 200) {
          console.log(apiResponse.data)
          this.toastr.success('Item deleted successfully');
          this.getAllLists(this.listUserId, this.listUserName);
          this.socketService.emitDeleteToDoItem(apiResponse.data, this.userId, this.userName);
          this.newItemName = "";
          this.currentListId = apiResponse.data.listDetails.listId;
        } else {
          this.toastr.error(apiResponse.message);
        }
      })
  }//end deleteToDoItem

  public changeStatusOfItem: any = (itemId, isCompleted) => {
    this.ngxSmartModalService.getModal('myModal').close();
    let data = {
      itemId: itemId,
      isCompleted: isCompleted,
      loggedOnUser: this.userName
    }

    this.appService.changeStatusOfItem(data)
      .subscribe((apiResponse) => {
        if (apiResponse.status === 200) {
          this.toastr.success('Item state changed successfully');
          this.getAllLists(this.listUserId, this.listUserName);
          this.socketService.emitChangeStatusOfItem(apiResponse.data, this.userId, this.userName);
          this.newItemName = "";
          this.currentListId = apiResponse.data.listDetails.listId;
        } else {
          this.toastr.error(apiResponse.message);
        }
      })
  }//end changeStatusOfItem

  public deleteList: any = (listId) => {
    let listData = {
      listId: listId,
      loggedOnUser: this.userName
    }

    this.appService.deleteList(listData)
      .subscribe((apiResponse) => {
        if (apiResponse.status === 200) {
          this.toastr.success('List deleted successfully');
          this.getAllLists(this.listUserId, this.listUserName);
          let details = {
            userId: this.userId,
            modifiedBy: this.userName,
            listId: listId
          }
          this.socketService.emitDeleteToDoList(details);
          this.currentListId = listId;
        } else {
          this.toastr.error(apiResponse.message);
        }
      })
  }//end deleteList

  public undoAction: any = () => {
    if (!this.currentListId) {
      this.toastr.warning('There are no actions to be undone')
    } else {
      this.appService.undoAction(this.currentListId)
        .subscribe((apiResponse) => {
          if (apiResponse.status === 200) {
            console.log(apiResponse.data)
            this.toastr.success('Previous Action has been undone');
            this.getAllLists(this.listUserId, this.listUserName);
            let details = {
              userId: this.userId,
              modifiedBy: this.userName
            }
            this.socketService.emitUndoAction(details);
          } else {
            this.toastr.error(apiResponse.message);
          }
        })
    }
  }//end UndoAction

  public getAllLists: any = (userId, userName) => {
    let loggedOnUser = Cookie.get('userId');

    this.appService.getAllLists(userId, loggedOnUser)
      .subscribe((apiResponse) => {
        if (apiResponse.status === 200) {
          this.toDoLists = apiResponse.data;
          for (var list of this.toDoLists) {
            let items = this.getNestedChildren(list.listItems, list.listId);
            list.toDoItems = items;
          }
        } else {
          this.toDoLists = [];
          //this.toastr.error(apiResponse.message);
        }
        this.listUserId = userId;
        this.listUserName = userName;
      })
  }//end getAllLists

  public getNestedChildren: any = (arr, parent) => {
    let items = [];
    let out = {
      listId: parent,
      items: []
    };
    for (var i in arr) {
      if (arr[i].parentId == parent) {
        var children = this.getNestedChildren(arr, arr[i].itemId);
        if (children.length) {
          arr[i].children = children;
        }
        items.push(arr[i]);
      }
    }
    return items;
  }//end getNestedChildren

  public viewItemDetails: any = (item, list) => {
    let modalData = {
      item: item,
      list: list
    }
    console.log(modalData)
    this.ngxSmartModalService.resetModalData('myModal');
    this.ngxSmartModalService.setModalData(modalData, 'myModal');
    this.ngxSmartModalService.getModal('myModal').open();


  }//end viewItemDetails

  public viewAddItemModal: any = (listId, parentId) => {
    let modalData = {
      listId: listId,
      parentId: parentId
    }
    console.log(modalData)
    this.ngxSmartModalService.resetModalData('addItemModal');
    this.ngxSmartModalService.setModalData(modalData, 'addItemModal');
    this.ngxSmartModalService.getModal('addItemModal').open();


  }//end viewItemDetails

  public logout: any = () => {
    this.appService.logout()
      .subscribe((apiResponse) => {
        if (apiResponse.status === 200) {
          //Cookie.deleteAll();
          this.toastr.success('Logged out successfully.');
          this.router.navigate(['/login']);
        } else {
          this.toastr.error(apiResponse.message)
          this.router.navigate(['/login']);
        }
      }, (err) => {
        this.toastr.error(`some error occured: ${err.message}`)
        this.router.navigate(['/login']);
      })
  }//end logout

  public undoUsingKeypress: any = (event: any) => {
    if ((event.which == 90 || event.keyCode == 90) && event.ctrlKey) { // 90 is keycode of z.
      this.undoAction();
    }
  }//end undoUsingKeyPress

}
