import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const demoEmail = 'demo@kadikoyfirin.com';

  const existingUser = await prisma.user.findUnique({
    where: { email: demoEmail },
  });

  if (existingUser) {
    console.log('Demo kullanıcı zaten mevcut.');
    return;
  }

  const bakery = await prisma.bakery.create({
    data: {
      name: 'Kadıköy Artizan Fırını',
      address: 'Caferağa Mah. Moda Cad. No:42',
      city: 'İstanbul',
      district: 'Kadıköy',
      phone: '0216 333 44 55',
      email: 'info@kadikoyfirin.com',
      taxNo: 'FRN-34-2024-0042',
    },
  });

  const passwordHash = await bcrypt.hash('demo123456', 12);

  await prisma.user.create({
    data: {
      email: demoEmail,
      passwordHash,
      firstName: 'Aylin',
      lastName: 'Kaya',
      role: 'admin',
      specialty: 'Baş Fırıncı',
      bakeryId: bakery.id,
    },
  });

  const customer1 = await prisma.customer.create({
    data: {
      companyName: 'Moda Kahvaltı Evi',
      contactName: 'Selin Arslan',
      phone: '0532 111 22 33',
      email: 'selin@modakahvalti.com',
      address: 'Moda Mah. Bahariye Cad. No:12',
      city: 'İstanbul',
      notes: 'Haftalık 200 adet ekşi mayalı ekmek siparişi',
      bakeryId: bakery.id,
    },
  });

  const customer2 = await prisma.customer.create({
    data: {
      companyName: 'Bebek Organik Market',
      contactName: 'Emre Yıldız',
      phone: '0533 444 55 66',
      email: 'emre@bebekorganik.com',
      address: 'Bebek Mah. Cevdet Paşa Cad. No:34',
      city: 'İstanbul',
      bakeryId: bakery.id,
    },
  });

  const customer3 = await prisma.customer.create({
    data: {
      companyName: 'Nişantaşı Butik Otel',
      contactName: 'Ayşe Koç',
      phone: '0535 777 88 99',
      email: 'ayse@nisantasi-boutique.com',
      city: 'İstanbul',
      notes: 'Günlük kruvasan ve poğaça tedariki',
      bakeryId: bakery.id,
    },
  });

  const recipe1 = await prisma.recipe.create({
    data: {
      name: 'Ekşi Mayalı Country Ekmeği',
      flourType: 'Taş Değirmen Tam Buğday',
      category: 'sourdough',
      hydrationPct: 72,
      fermentHours: 18,
      bakeTemp: 230,
      bakeMinutes: 40,
      description: 'Uzun fermantasyonlu, kabuklu country ekmek',
      bakeryId: bakery.id,
    },
  });

  const recipe2 = await prisma.recipe.create({
    data: {
      name: 'Tereyağlı Kruvasan',
      flourType: 'Tip 45 Un',
      category: 'viennoiserie',
      hydrationPct: 55,
      fermentHours: 8,
      bakeTemp: 200,
      bakeMinutes: 22,
      description: 'El açması kat kat kruvasan',
      bakeryId: bakery.id,
    },
  });

  await prisma.ingredient.createMany({
    data: [
      { name: 'Taş Değirmen Tam Buğday Unu', category: 'flour', storage: 'dry', stockKg: 280, unitCost: 42, supplier: 'Anadolu Değirmen', batchYear: 2024, bakeryId: bakery.id },
      { name: 'Tip 45 Pastane Unu', category: 'flour', storage: 'dry', stockKg: 150, unitCost: 38, supplier: 'Ulusoy Un', batchYear: 2024, bakeryId: bakery.id },
      { name: 'Ekşi Mayalı Kültür', category: 'yeast', storage: 'refrigerated', stockKg: 3, unitCost: 120, supplier: 'Atölye Kültürü', batchYear: 2024, bakeryId: bakery.id },
      { name: 'Tereyağı (%82)', category: 'dairy', storage: 'refrigerated', stockKg: 45, unitCost: 285, supplier: 'Karadeniz Süt', batchYear: 2024, bakeryId: bakery.id },
      { name: 'Kaya Tuzu', category: 'other', storage: 'dry', stockKg: 12, unitCost: 18, supplier: 'Tuzla Tuz', batchYear: 2024, bakeryId: bakery.id },
    ],
  });

  const now = new Date();
  const tomorrow = new Date(now.getTime() + 86400000);
  const nextWeek = new Date(now.getTime() + 7 * 86400000);

  await prisma.productionBatch.createMany({
    data: [
      {
        date: now,
        duration: 90,
        type: 'daily_bread',
        status: 'in_progress',
        bakerName: 'Aylin Kaya',
        quantityUnits: 120,
        customerId: customer1.id,
        bakeryId: bakery.id,
        notes: 'Sabah fırın partisi — country ekmek',
      },
      {
        date: tomorrow,
        duration: 120,
        type: 'pastry_batch',
        status: 'planned',
        bakerName: 'Mehmet Öz',
        quantityUnits: 80,
        customerId: customer3.id,
        bakeryId: bakery.id,
        notes: 'Kruvasan ve poğaça üretimi',
      },
      {
        date: nextWeek,
        duration: 60,
        type: 'special_order',
        status: 'planned',
        bakerName: 'Aylin Kaya',
        quantityUnits: 40,
        customerId: customer2.id,
        bakeryId: bakery.id,
      },
    ],
  });

  await prisma.order.createMany({
    data: [
      {
        productName: 'Country Ekmeği',
        quantityUnits: 200,
        productCategory: 'sourdough',
        status: 'confirmed',
        totalPrice: 4800,
        paidAmount: 2400,
        orderDate: now,
        deliveryDate: tomorrow,
        customerId: customer1.id,
        recipeId: recipe1.id,
        bakeryId: bakery.id,
        notes: 'Haftalık düzenli sipariş',
      },
      {
        productName: 'Kruvasan Kutusu (24 adet)',
        quantityUnits: 24,
        productCategory: 'viennoiserie',
        status: 'baking',
        totalPrice: 960,
        paidAmount: 960,
        orderDate: now,
        customerId: customer3.id,
        recipeId: recipe2.id,
        bakeryId: bakery.id,
      },
      {
        productName: 'Tam Buğday Somun',
        quantityUnits: 100,
        productCategory: 'white_bread',
        status: 'quoted',
        totalPrice: 2200,
        paidAmount: 0,
        orderDate: tomorrow,
        customerId: customer2.id,
        bakeryId: bakery.id,
      },
    ],
  });

  console.log('Demo verileri başarıyla oluşturuldu.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
