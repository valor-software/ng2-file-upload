import { OnInit, ElementRef, EventEmitter } from 'angular2/core';
export declare class Alert implements OnInit {
    el: ElementRef;
    private type;
    private dismissible;
    private dismissOnTimeout;
    close: EventEmitter<Alert>;
    templateUrl: string;
    private closed;
    private classes;
    constructor(el: ElementRef);
    ngOnInit(): void;
    onClose(): void;
}
