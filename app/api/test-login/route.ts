import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    
    console.log('🔐 Teste de login direto:', { email, password })
    
    if (!email || !password) {
      return NextResponse.json({ error: 'Credenciais obrigatórias' }, { status: 400 })
    }

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { email }
    }) as any

    if (!user) {
      console.log('❌ Usuário não encontrado')
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }

    console.log('✅ Usuário encontrado:', {
      id: user.id,
      email: user.email,
      hasPassword: !!user.password,
      isAdmin: user.isAdmin,
      isActive: user.isActive
    })

    if (!user.password) {
      console.log('❌ Usuário sem senha')
      return NextResponse.json({ error: 'Usuário sem senha' }, { status: 400 })
    }

    // Verificar senha
    const isValid = await bcrypt.compare(password, user.password)
    console.log('🔓 Senha válida:', isValid)

    if (!isValid) {
      return NextResponse.json({ error: 'Senha inválida' }, { status: 401 })
    }

    if (!user.isAdmin) {
      console.log('❌ Usuário não é admin')
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
    }

    if (!user.isActive) {
      console.log('❌ Usuário inativo')
      return NextResponse.json({ error: 'Usuário inativo' }, { status: 403 })
    }

    console.log('✅ Login bem-sucedido!')
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin
      }
    })

  } catch (error) {
    console.error('❌ Erro no teste de login:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}