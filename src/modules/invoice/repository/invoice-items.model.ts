import { BelongsTo, Column, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { InvoiceModel } from "./invoice.model";

@Table({
    tableName: "items",
    timestamps: false,
  })
  export class InvoiceItemsModel extends Model {
    @PrimaryKey
    @Column({ allowNull: false })
    declare id: string;
  
    @Column({ allowNull: false })
    declare name: string;
  
    @Column({ allowNull: false })
    declare price: number;
  
    //@ForeignKey(() => InvoiceModel)
    //@Column({ allowNull: false })
    //declare invoice_id: string;
  
    //@BelongsTo(() => InvoiceModel)
    //declare invoice: InvoiceModel;
    @ForeignKey(() => require('./invoice.model').InvoiceModel)
    @Column({ allowNull: false })
    declare invoice_id: string;
  
    @BelongsTo(() => require('./invoice.model').InvoiceModel)
    declare invoice: InstanceType<any>;
  

  }