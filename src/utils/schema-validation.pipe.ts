/* eslint-disable @typescript-eslint/ban-types */
import { ArgumentMetadata } from "@nestjs/common";
import { Injectable, PipeTransform } from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import {
  SchemaValidationError,
  ItemValidationError,
} from "../errors/SchemaValidationFailed";

@Injectable()
export class SchemaValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.validateMetaType(metatype)) {
      return value;
    }

    const object = plainToClass(metatype, value);
    const errors = await validate(object);

    if (errors.length > 0) {
      const failedValidations = errors.map((error) =>
        this.mapValidationError(error)
      );
      throw new SchemaValidationError(failedValidations);
    }

    return object;
  }

  private mapValidationError(error: ValidationError): ItemValidationError {
    return new ItemValidationError(
      error.property,
      this.getClassName(error),
      this.getMessage(error)
    );
  }

  private getConstraints(error) {
    if (error.constraints) return error.constraints;
    if (!error.children || error.children.length === 0) return null;
    return this.getConstraints(error.children[0]);
  }

  private getMessage(error: ValidationError): string {
    const constraints = this.getConstraints(error);
    if (!constraints) return "";
    return Object.keys(constraints)
      .map((key) => constraints[key])
      .join(", ");
  }

  private getClassName(error: ValidationError): string {
    if (typeof error.target === "undefined") return "undefined";
    if (error.target === null) return "null";
    return error.target.constructor.name;
  }

  private validateMetaType(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
