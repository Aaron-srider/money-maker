export class Timespan {
    start: Date;
    end: Date;

    constructor(start: Date, end: Date) {
        this.start = start;
        this.end = end;
    }

    inside(timePoint: Date): boolean {
        return (
            timePoint.getTime() >= this.start.getTime() &&
            timePoint.getTime() <= this.end.getTime()
        );
    }
    after(timePoint: Date): boolean {
        return timePoint.getTime() > this.end.getTime();
    }

    before(timePoint: Date): boolean {
        return !this.after(timePoint) && !this.inside(timePoint);
    }

    span(): number {
        return this.end.getTime() - this.start.getTime();
    }
}
