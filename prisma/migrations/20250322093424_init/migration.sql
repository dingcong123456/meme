-- CreateTable
CREATE TABLE "token_transaction_statistics" (
    "id" TEXT NOT NULL,
    "token_address" TEXT NOT NULL,
    "sell_total_amount" TEXT NOT NULL,
    "sell_total_token_amount" TEXT NOT NULL,
    "sell_count" INTEGER NOT NULL,
    "buy_total_amount" TEXT NOT NULL,
    "buy_total_token_amount" TEXT NOT NULL,
    "buy_count" INTEGER NOT NULL,
    "last_updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "token_transaction_statistics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "token_transaction_statistics_token_address_key" ON "token_transaction_statistics"("token_address");

-- AddForeignKey
ALTER TABLE "token_transaction_statistics" ADD CONSTRAINT "token_transaction_statistics_token_address_fkey" FOREIGN KEY ("token_address") REFERENCES "token"("address") ON DELETE RESTRICT ON UPDATE CASCADE;
