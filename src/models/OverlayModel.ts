import {CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model,} from '@sequelize/core';
import {Attribute, AutoIncrement, NotNull, PrimaryKey} from '@sequelize/core/decorators-legacy';

export class OverlayModel extends Model<InferAttributes<OverlayModel>, InferCreationAttributes<OverlayModel>> {

    @Attribute(DataTypes.INTEGER)
    @PrimaryKey
    @AutoIncrement
    declare id: CreationOptional<number>;

    @Attribute(DataTypes.STRING)
    @NotNull
    declare name: string;

    @Attribute(DataTypes.STRING)
    declare path: string;
    
    @Attribute(DataTypes.INTEGER)
    declare minZoom: number;
    
    @Attribute(DataTypes.INTEGER)
    declare maxZoom: number;
    
    @Attribute(DataTypes.STRING)
    declare status: string;
}