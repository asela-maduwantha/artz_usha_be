export interface CustomizationValue {
    id: string;
    value: any;
  }
  
  export interface CustomizationData {
    [key: string]: CustomizationValue;
  }