import Address from "../../@shared/domain/value-object/address";
import Id from "../../@shared/domain/value-object/id.value-object";
import Invoice from "../domain/invoice.entity";
import InvoiceItems from "../domain/invoiceItems.entity";
import InvoiceGateway from "../gateway/invoice.gateway";
import { InvoiceItemsModel } from "./invoice-items.model";
import { InvoiceModel } from "./invoice.model";

export default class InvoiceRepository implements InvoiceGateway {
    async generate(invoice: Invoice): Promise<void> {
      await InvoiceModel.create({
        id: invoice.id.id,
        name: invoice.name,
        document: invoice.document,
        street: invoice.address.street,
        number: invoice.address.number,
        complement: invoice.address.complement,
        city: invoice.address.city,
        state: invoice.address.state,
        zipcode: invoice.address.zipCode,
        items: invoice.items.map(item => ({
          id: item.id.id,
          name: item.name,
          price: item.price

        })),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        include: [{ model: InvoiceItemsModel }],
      })
    }
    async find(id: string): Promise<Invoice> {
      const invoice = await InvoiceModel.findOne(
        { 
          where: { 
            id
          },
          include: [
            { 
              model:InvoiceItemsModel
            }
          ]
        }
      );
  
      if (!invoice) {
        throw new Error("Invoice not found");
      }
  
      return new Invoice({
        id: new Id(invoice.id),
        name: invoice.name,
        document: invoice.document,
        address: new Address(
           invoice.street,
           invoice.number,
           invoice.complement,
         invoice.city,
           invoice.state,
           invoice.zipcode,
        ),
        items: invoice.items.map(item => new InvoiceItems(
          { 
            id: new Id(item.id), 
            name: item.name, 
            price: item.price
          }
        )),
        createdAt: invoice.createdAt,
        updatedAt: invoice.updatedAt,
      })
    }
  }