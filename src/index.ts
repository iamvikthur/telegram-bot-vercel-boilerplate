import { Context, Telegraf } from 'telegraf';

import { about } from './commands';
import { greeting } from './text';
import { VercelRequest, VercelResponse } from '@vercel/node';
import { development, production } from './core';

const BOT_TOKEN = process.env.BOT_TOKEN || '';
const ENVIRONMENT = process.env.NODE_ENV || '';

const bot = new Telegraf(BOT_TOKEN);

bot.start(async (ctx: Context) => {
  console.log("+++++ BOT START +++++");
  await startAction(ctx);
});

async function startAction(ctx: Context) {
  const userId = ctx.from.id;
  let firstname = ctx.from.first_name;
  await bot.telegram.sendChatAction(userId, "typing");
  await bot.telegram.sendMessage(userId, `Hello ${firstname}`);
}

bot.command('about', about());
bot.on('message', greeting());

//prod mode (Vercel)
export const startVercel = async (req: VercelRequest, res: VercelResponse) => {
  await production(req, res, bot);
};
//dev mode
ENVIRONMENT !== 'production' && development(bot);
