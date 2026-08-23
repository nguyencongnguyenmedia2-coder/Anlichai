declare module 'lunar-javascript' {
  export const Solar: {
    fromYmd: (year: number, month: number, day: number) => any;
    fromDate: (date: Date) => any;
  };
  export const Lunar: {
    fromYmd: (year: number, month: number, day: number) => any;
    fromDate: (date: Date) => any;
  };
  export const LunarMonth: any;
}
