import { NestFactory } from "@nestjs/core";
import {
  Controller,
  Get,
  Module,
  Render,
} from "@nestjs/common";
import { NestExpressApplication } from '@nestjs/platform-express';
import "@nestjs/platform-express";
import * as path from "jsr:@std/path";

const port = 3000;
const hostname = "localhost";

@Controller()
class RootController {
  @Get("/")
  @Render('index')
  Get() {
    return { };
  }
}

@Controller()
class NewPageController {
  @Get("/new")
  @Render('new')
  Get() {
    return { };
  }
}

@Controller()
class PageController {
  @Get("/@username/ascii-start/settings")
  @Render('settings')
  Settings() {
    return { };
  }
  
  @Get("/@username/ascii-start/overview")
  @Render('overview')
  Overview() {
    return { };
  }

  @Get("/@username/ascii-start/0.0.1")
  @Render('view')
  View() {
    return { };
  }
}

@Module({ controllers: [RootController, NewPageController, PageController] })
class AppModule {}
const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    {
      httpsOptions: {
        key: Deno.readTextFileSync("./certs/key.pem"),
        cert: Deno.readTextFileSync("./certs/cert.pem"),
      },
    }
);

app.useStaticAssets(path.join(Deno.cwd(), 'public'));
app.setBaseViewsDir(path.join(Deno.cwd(), 'views'));
app.setViewEngine('hbs');

app.listen(port, hostname);
