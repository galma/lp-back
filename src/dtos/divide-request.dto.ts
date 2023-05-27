import { IsNumber } from "class-validator";

// function IsNotEqualToZero(message?: string) {
//   return function(object: Object, propertyName: string) {
//     registerDecorator({
//       name: "isNotEqualToZero",
//       target: object.constructor,
//       propertyName: propertyName,
//       options: {
//         message: message || `${propertyName} must be different than 0`,
//       },
//       validator: {
//         validate(value: any) {
//           return value !== 0;
//         },
//       },
//     });
//   };
// }

export class DivideRequestDto {
  @IsNumber()
  number1: number;

  @IsNumber()
  number2: number;
}
