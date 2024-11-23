import { Sequelize } from "sequelize-typescript";
import { InvoiceModel } from "./invoice.model";
import { InvoiceItemsModel } from "./invoice-items.model";
import Id from "../../@shared/domain/value-object/id.value-object";
import Address from "../../@shared/domain/value-object/address";
import InvoiceItems from "../domain/invoiceItems.entity";
import Invoice from "../domain/invoice.entity";
import InvoiceRepository from "./invoice.repository";

describe("InvoiceRepository test", () => {
    let sequelize: Sequelize;
  
    beforeEach(async () => {
      sequelize = new Sequelize({
        dialect: "sqlite",
        storage: ":memory:",
        logging: false,
        sync: { force: true },
      });
  
      await sequelize.addModels([InvoiceModel, InvoiceItemsModel]);
      await sequelize.sync();
    });
  
    afterEach(async () => {
      await sequelize.close();
    });
  
    it("should generate an invoice", async () => {
      const invoiceProps = {
        id: new Id("1"), 
        name: "Invoice 1",
        document: "Invoice 1 document",
        address: new Address(
           "Street 1",
          "1",
           "casa 1",
           "São Paulo",
           "SP",
           "04452-222",
        ),
        items: [
          new InvoiceItems({
            id: new Id("1"),
            name: "Product 1",
            price: 100
          })
        ]
      };
      const invoice = new Invoice(invoiceProps);
      const invoiceRepository = new InvoiceRepository();
      await invoiceRepository.generate(invoice);
  
      const invoiceDb = await InvoiceModel.findOne({
        where: { id: invoiceProps.id.id },
        include: ["items"],
      });
  
      expect(invoiceDb).toBeDefined()
      expect(invoiceDb.id).toEqual(invoiceProps.id.id);
      expect(invoiceDb.name).toEqual(invoiceProps.name);
      expect(invoiceDb.document).toEqual(invoiceProps.document);
      expect(invoiceDb.city).toEqual(invoiceProps.address.city);
      expect(invoiceDb.complement).toEqual(invoiceProps.address.complement);
      expect(invoiceDb.number).toEqual(invoiceProps.address.number);
      expect(invoiceDb.state).toEqual(invoiceProps.address.state);
      expect(invoiceDb.street).toEqual(invoiceProps.address.street);
      expect(invoiceDb.zipcode).toEqual(invoiceProps.address.zipCode);
      expect(invoiceDb.items).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: "1",
            name: "Product 1",
            price: 100,
            invoice_id: "1"
          })
        ])
      );
    })
  
    it("should find an invoice", async () => {
      const invoice = await InvoiceModel.create({
        id: "1",
        name: "Invoice 1",
        document: "123",
        street: "Street 1",
        number: "1",
        complement: "Complement 1",
        city: "São Paulo",
        state: "São Paulo",
        zipCode: "1234567890",
        items: [
          {
            id: "1",
            name: "Product 1",
            price: 10,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: "2",
            name: "Product 2",
            price: 20

          }
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        include: [{ model: InvoiceItemsModel }],
      }
  );
  
      const repository = new InvoiceRepository();
      const result = await repository.find(invoice.id);
  
      expect(result.id.id).toEqual(invoice.id);
      expect(result.name).toEqual(invoice.name);
      expect(result.address.street).toEqual(invoice.street);
      expect(result.address.number).toEqual(invoice.number);
      expect(result.address.complement).toEqual(invoice.complement);
      expect(result.address.city).toEqual(invoice.city);
      expect(result.address.state).toEqual(invoice.state);
      expect(result.address.zipCode).toEqual(invoice.zipcode);
      expect(result.items[0].id.id).toEqual(invoice.items[0].id);
      expect(result.items[0].name).toEqual(invoice.items[0].name);
      expect(result.items[0].price).toEqual(invoice.items[0].price);
      expect(result.items[0].createdAt).toStrictEqual(invoice.items[0].createdAt);
      expect(result.items[0].updatedAt).toStrictEqual(invoice.items[0].updatedAt);
      expect(result.address.zipCode).toEqual(invoice.zipcode);
      expect(result.items[1].id.id).toEqual(invoice.items[1].id);
      expect(result.items[1].name).toEqual(invoice.items[1].name);
      expect(result.items[1].price).toEqual(invoice.items[1].price);
      expect(result.items[1].createdAt).toStrictEqual(invoice.items[1].createdAt);
      expect(result.items[1].updatedAt).toStrictEqual(invoice.items[1].updatedAt);
      expect(result.createdAt).toStrictEqual(invoice.createdAt);
    });
    
  })