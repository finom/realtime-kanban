import { post, prefix } from "vovk";
import { NextRequest } from "next/server";
import TelegramService from "./TelegramService";

@prefix("telegram")
export default class TelegramController {
  @post("bot")
  static async handle(request: NextRequest) {
    return TelegramService.handle(request);
  }
}
