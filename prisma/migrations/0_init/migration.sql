-- CreateTable
CREATE TABLE "user" (
    "user_id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "bio" TEXT,
    "create_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_time" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "token" (
    "token_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ticker" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "telegram" TEXT,
    "weblink" TEXT,
    "twitter" TEXT,
    "token_info" TEXT,
    "create_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_time" TIMESTAMP(3) NOT NULL,
    "decimals" TEXT,
    "fee" TEXT,
    "from" TEXT,
    "gas_price" TEXT,
    "gas_used" TEXT,
    "to" TEXT,
    "address" TEXT,
    "bond_address" TEXT,

    CONSTRAINT "token_pkey" PRIMARY KEY ("token_id")
);

-- CreateTable
CREATE TABLE "transaction" (
    "transaction_id" TEXT NOT NULL,
    "token_amount" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "current_price" TEXT,
    "fee" TEXT,
    "gas_price" TEXT,
    "gas_used" TEXT,
    "to" TEXT,
    "address" TEXT NOT NULL,
    "amount" TEXT,
    "hoster" TEXT,
    "type" INTEGER,

    CONSTRAINT "transaction_pkey" PRIMARY KEY ("transaction_id")
);

-- CreateTable
CREATE TABLE "user_token" (
    "user_token_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "token_id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL DEFAULT 0,
    "create_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_time" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_token_pkey" PRIMARY KEY ("user_token_id")
);

-- CreateTable
CREATE TABLE "price_history" (
    "price_history_id" TEXT NOT NULL,
    "token_address" TEXT NOT NULL,
    "origin_price" BIGINT NOT NULL,
    "formatted_price" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "price_history_pkey" PRIMARY KEY ("price_history_id")
);

-- CreateTable
CREATE TABLE "price_statistics" (
    "price_statistics_id" TEXT NOT NULL,
    "token_address" TEXT NOT NULL,
    "min_price" BIGINT NOT NULL,
    "max_price" BIGINT NOT NULL,
    "start_price" BIGINT NOT NULL,
    "end_price" BIGINT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "price_statistics_pkey" PRIMARY KEY ("price_statistics_id")
);

-- CreateTable
CREATE TABLE "comment" (
    "comment_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "token_id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "image" TEXT,
    "create_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reply_to_id" TEXT,

    CONSTRAINT "comment_pkey" PRIMARY KEY ("comment_id")
);

-- CreateTable
CREATE TABLE "token_transaction" (
    "id" TEXT NOT NULL,
    "type" INTEGER,
    "address" TEXT,
    "hash" TEXT,
    "user_id" TEXT,
    "amount" TEXT,
    "token_amount" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tokenAddress" TEXT,

    CONSTRAINT "token_transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_address_key" ON "user"("address");

-- CreateIndex
CREATE UNIQUE INDEX "token_ticker_key" ON "token"("ticker");

-- CreateIndex
CREATE UNIQUE INDEX "token_address_key" ON "token"("address");

-- CreateIndex
CREATE UNIQUE INDEX "token_transaction_hash_key" ON "token_transaction"("hash");

-- AddForeignKey
ALTER TABLE "token" ADD CONSTRAINT "token_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_address_fkey" FOREIGN KEY ("address") REFERENCES "token"("address") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_token" ADD CONSTRAINT "user_token_token_id_fkey" FOREIGN KEY ("token_id") REFERENCES "token"("token_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_token" ADD CONSTRAINT "user_token_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_reply_to_id_fkey" FOREIGN KEY ("reply_to_id") REFERENCES "comment"("comment_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_token_id_fkey" FOREIGN KEY ("token_id") REFERENCES "token"("token_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

