import { Controller, Get, Header, Param } from '@nestjs/common'
import type { Observable } from 'rxjs'
import { of } from 'rxjs'
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { HelloService } from './hello.service'
import { UserByIdPipe } from './users/user-by-id.pipe'

@Controller('hello')
export class HelloController {
  constructor(private readonly helloService: HelloService) {}

  @Get()
  @Header('Authorization', 'Bearer')
  greeting(): string {
    return this.helloService.greeting()
  }

  @Get('async')
  async asyncGreeting(): Promise<string> {
    return this.helloService.greeting()
  }

  @Get('stream')
  streamGreeting(): Observable<string> {
    return of(this.helloService.greeting())
  }

  @Get('local-pipe/:id')
  localPipe(
    @Param('id', UserByIdPipe)
    user: any
  ): any {
    return user
  }
}
