import {
    Sequelize,
    DataTypes,
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
} from '@sequelize/core';
import { Attribute, PrimaryKey, AutoIncrement, NotNull } from '@sequelize/core/decorators-legacy';

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
   
    @Attribute(DataTypes.INTEGER)
    @PrimaryKey
    @AutoIncrement
    declare id: CreationOptional<number>;

    @Attribute(DataTypes.STRING)
    @NotNull
    declare type: string;


    @Attribute(DataTypes.JSON)
    @NotNull
    declare payload: any;
}