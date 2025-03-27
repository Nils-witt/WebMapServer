import {CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model,} from '@sequelize/core';
import {Attribute, AutoIncrement, NotNull, PrimaryKey, Unique} from '@sequelize/core/decorators-legacy';

export class UnitModel extends Model<InferAttributes<UnitModel>, InferCreationAttributes<UnitModel>> {

    @Attribute(DataTypes.INTEGER)
    @PrimaryKey
    @AutoIncrement
    declare id: CreationOptional<number>;

    @Attribute(DataTypes.STRING)
    @NotNull
    @Unique
    declare name: string;

    @Attribute(DataTypes.INTEGER)
    declare status: number;
    
    @Attribute(DataTypes.JSON)
    declare tz: any
    
    @Attribute(DataTypes.FLOAT)
    declare latitude: number;
    
    @Attribute(DataTypes.FLOAT)
    declare longitude: number;
}