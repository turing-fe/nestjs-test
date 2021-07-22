// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { INestApplication, Scope } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import * as request from 'supertest'
import { expect } from 'chai'
import { HelloModule } from '../src/circular-transient/hello.module'
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { HelloService } from '../src/circular-transient/hello.service'
import { HelloController } from '../src/circular-transient/hello.controller'
import { UsersService } from '../src/circular-transient/users/users.service'

class Meta {
  static COUNTER = 0
  constructor(private readonly helloService: HelloService) {
    Meta.COUNTER++
  }
}

describe('Circular transient scope', () => {
  let server
  let app: INestApplication

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        HelloModule.forRoot({
          provide: 'META',
          useClass: Meta,
          scope: Scope.TRANSIENT
        })
      ]
    }).compile()

    app = module.createNestApplication()
    server = app.getHttpServer()
    await app.init()
  })

  afterEach(async () => {
    await app.close()
  })

  describe('when one service is request scoped', () => {
    beforeEach(async () => {
      const performHttpCall = end => {
        request(server)
          .get('/hello')
          .end((err, res) => {
            if (err) return end(err)
            end()
          })
      }
      await new Promise(resolve => performHttpCall(resolve))
      await new Promise(resolve => performHttpCall(resolve))
      await new Promise(resolve => performHttpCall(resolve))
    })

    it(`should create controller for each request`, async () => {
      expect(HelloController.COUNTER).to.be.eql(3)
    })

    it(`should create service for each request`, async () => {
      expect(UsersService.COUNTER).to.be.eql(3)
    })

    it(`should create service for each request`, async () => {
      expect(HelloService.COUNTER).to.be.eql(3)
    })

    it(`should create provider for each inquirer`, async () => {
      expect(Meta.COUNTER).to.be.eql(7)
    })
  })
})
