<template>
    <div class="hello">
        <div>when you start work?</div>

        <el-time-picker
            v-model="startTime"
            :picker-options="{
                selectableRange: '00:00:00 - 23:59:59',
            }"
            placeholder="pick a time"
        ></el-time-picker>
        <div>
            <div>
                You have made
                <!--<span class="fs20 pdr8">$</span>-->
                <span style="color: red; font-size: 40px; font-weight: bold">
                    {{ income }}
                </span>
                <span class="fs20">RMB</span>
                today
            </div>
            <div>
                <span class="fs20">{{ timeSpan }}</span>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Timespan } from "@/ts/TimeSpan";
import { Component, Vue } from "vue-property-decorator";

@Component
export default class MoneyMakerView extends Vue {
    timeSpan = "xx:xx:xx";
    startTimeString = "";

    updateStartTime() {
        this.startTime = new Date(this.startTimeString);
    }

    calIntervalValue(startTime: Date, endTime: Date): number {
        // Calculate the time interval in milliseconds
        const intervalInMilliseconds = endTime.getTime() - startTime.getTime();
        return intervalInMilliseconds;
    }

    calInterval(startTime: Date, endTime: Date) {
        // Calculate the time interval in milliseconds
        const intervalInMilliseconds = endTime.getTime() - startTime.getTime();

        // Convert the interval to a more human-readable format
        const millisecondsInOneSecond = 1000;
        const millisecondsInOneMinute = 1000 * 60;
        const millisecondsInOneHour = millisecondsInOneMinute * 60;
        const millisecondsInOneDay = millisecondsInOneHour * 24;

        const days = Math.floor(intervalInMilliseconds / millisecondsInOneDay);
        const hours = Math.floor(
            (intervalInMilliseconds % millisecondsInOneDay) /
            millisecondsInOneHour
        );
        const minutes = Math.floor(
            (intervalInMilliseconds % millisecondsInOneHour) /
            millisecondsInOneMinute
        );
        const seconds = Math.floor(
            (intervalInMilliseconds % millisecondsInOneMinute) /
            millisecondsInOneSecond
        );

        return { days, hours, minutes, seconds };
    }

    startTime: Date = this.getTimePoint(9, 40, 0, 0);

    getTimePoint(
        specificTimeHours: number,
        specificTimeMinutes: number,
        specificTimeSeconds: number,
        specificTimeMilliseconds: number
    ): Date {
        // Get the current date
        const currentDate = new Date();

        // Create a Date object for the specific time point
        const specificTimeDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate(),
            specificTimeHours,
            specificTimeMinutes,
            specificTimeSeconds,
            specificTimeMilliseconds
        );
        return specificTimeDate;
    }

    salary = 15000;

    oneDayWorkTime = 7.5 * 3600 * 1000;

    calIncome(): number {
        let workdayNumber = 23;

        let oneDayWorkProcess = this.getTimeSpan();
        let oneDayIncome = (this.salary * 1.0) / workdayNumber;
        let incomeTillNow =
            (oneDayIncome * 1.0 * oneDayWorkProcess) / this.oneDayWorkTime;

        return incomeTillNow;
    }

    income = "0";

    breakTimeList: Timespan[] = [
        new Timespan(
            this.getTimePoint(12, 0, 0, 0),
            this.getTimePoint(14, 0, 0, 0)
        )
    ];

    calculateOverlap(start: Date, end: Date, scales: Timespan[]): number {
        let total_overlap = 0;

        for (let scale of scales) {
            // If there is no overlap, continue
            if (scale.before(end) || scale.after(start)) {
                continue;
            }

            // Calculate overlap for the current time scale
            let overlap_start = new Date(
                Math.max(start.getTime(), scale.start.getTime())
            );
            let overlap_end = new Date(
                Math.min(end.getTime(), scale.end.getTime())
            );

            total_overlap += overlap_end.getTime() - overlap_start.getTime();
        }

        return total_overlap;
    }

    getTimeSpan(): number {
        let now = new Date();
        // update time
        let timeSpanValue = this.calIntervalValue(this.startTime, now);
        timeSpanValue -= this.calculateOverlap(
            this.startTime,
            now,
            this.breakTimeList
        );
        if (timeSpanValue > this.oneDayWorkTime) {
            timeSpanValue = this.oneDayWorkTime;
        }
        return timeSpanValue;
    }

    formatTimeValue(timeValue: number): string {
        // Create a Date object
        const date = new Date(timeValue);

        // Extract hours, minutes, and seconds
        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");
        const seconds = date.getSeconds().toString().padStart(2, "0");

        // Format as "HH:mm:ss"
        return `${hours}:${minutes}:${seconds}`;
    }

    formatTimeSpanValue(intervalInMilliseconds: number): string {
        // Convert the interval to a more human-readable format
        const millisecondsInOneSecond = 1000;
        const millisecondsInOneMinute = 1000 * 60;
        const millisecondsInOneHour = millisecondsInOneMinute * 60;
        const millisecondsInOneDay = millisecondsInOneHour * 24;
        const days = Math.floor(intervalInMilliseconds / millisecondsInOneDay);
        const hours = Math.floor(
            (intervalInMilliseconds % millisecondsInOneDay) /
            millisecondsInOneHour
        );
        const minutes = Math.floor(
            (intervalInMilliseconds % millisecondsInOneHour) /
            millisecondsInOneMinute
        );
        const seconds = Math.floor(
            (intervalInMilliseconds % millisecondsInOneMinute) /
            millisecondsInOneSecond
        );

        return `${hours.toString().padStart(2, "0")}:
        ${minutes.toString().padStart(2, "0")}:
        ${seconds.toString().padStart(2, "0")}`;
    }

    mounted() {
        setInterval(() => {
            let timeSpanValue = this.getTimeSpan();

            const timeString = this.formatTimeSpanValue(timeSpanValue);

            this.timeSpan = timeString;

            // update salary
            let incomeTillNow = this.calIncome();

            this.income = incomeTillNow.toFixed(2);
        }, 1000);
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
    margin: 40px 0 0;
}

ul {
    list-style-type: none;
    padding: 0;
}

li {
    display: inline-block;
    margin: 0 10px;
}

a {
    color: #42b983;
}
</style>
