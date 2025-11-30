import { post, prefix } from "vovk";
import TelegramService from "./TelegramService";

@prefix("telegram")
export default class TelegramController {
  @post("bot")
  handle = TelegramService.handle;
}
