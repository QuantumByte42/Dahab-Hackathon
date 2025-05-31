/**
* This file was @generated using pocketbase-typegen
*/

import type PocketBase from 'pocketbase'
import type { RecordService } from 'pocketbase'

export enum Collections {
	Authorigins = "_authOrigins",
	Externalauths = "_externalAuths",
	Mfas = "_mfas",
	Otps = "_otps",
	Superusers = "_superusers",
	Customers = "customers",
	Employees = "employees",
	Inventory = "inventory",
	Invoices = "invoices",
	Users = "users",
	Vendors = "vendors",
}

// Alias types for improved usability
export type IsoDateString = string
export type RecordIdString = string
export type HTMLString = string

type ExpandType<T> = unknown extends T
	? T extends unknown
		? { expand?: unknown }
		: { expand: T }
	: { expand: T }

// System fields
export type BaseSystemFields<T = unknown> = {
	id: RecordIdString
	collectionId: string
	collectionName: Collections
} & ExpandType<T>

export type AuthSystemFields<T = unknown> = {
	email: string
	emailVisibility: boolean
	username: string
	verified: boolean
} & BaseSystemFields<T>

// Record types for each collection

export type AuthoriginsRecord = {
	collectionRef: string
	created?: IsoDateString
	fingerprint: string
	id: string
	recordRef: string
	updated?: IsoDateString
}

export type ExternalauthsRecord = {
	collectionRef: string
	created?: IsoDateString
	id: string
	provider: string
	providerId: string
	recordRef: string
	updated?: IsoDateString
}

export type MfasRecord = {
	collectionRef: string
	created?: IsoDateString
	id: string
	method: string
	recordRef: string
	updated?: IsoDateString
}

export type OtpsRecord = {
	collectionRef: string
	created?: IsoDateString
	id: string
	password: string
	recordRef: string
	sentTo?: string
	updated?: IsoDateString
}

export type SuperusersRecord = {
	created?: IsoDateString
	email: string
	emailVisibility?: boolean
	id: string
	password: string
	tokenKey: string
	updated?: IsoDateString
	verified?: boolean
}

export type CustomersRecord = {
	address?: string
	created?: IsoDateString
	email?: string
	id: string
	last_purchase?: IsoDateString
	name: string
	phone?: string
	purchase_count?: number
	total_purchases?: number
	updated?: IsoDateString
}

export enum EmployeesRoleOptions {
	"Manager" = "Manager",
	"Cashier" = "Cashier",
}
export type EmployeesRecord = {
	created?: IsoDateString
	email?: string
	id: string
	is_active?: boolean
	merchant_id?: string
	name?: string
	phone?: string
	role?: EmployeesRoleOptions
	updated?: IsoDateString
}

export enum InventoryTypeOptions {
	"Ring" = "Ring",
	"Bracelet" = "Bracelet",
	"Necklace" = "Necklace",
	"Earrings" = "Earrings",
	"Pendant" = "Pendant",
	"Chain" = "Chain",
	"Bangle" = "Bangle",
}

export enum InventoryKaratOptions {
	"E24" = "24",
	"E22" = "22",
	"E21" = "21",
	"E18" = "18",
	"E14" = "14",
	"E10" = "10",
	"E6" = "6",
}
export type InventoryRecord = {
	cost_price?: number
	created?: IsoDateString
	id: string
	item_id: string
	item_name: string
	karat: InventoryKaratOptions | string
	quantity: number
	selling_price: number
	type: InventoryTypeOptions | string
	updated?: IsoDateString
	vendor?: RecordIdString
	weight: number
	expand?: {vendor?: VendorsRecord}
}

export enum InvoicesTypeOptions {
	"cash" = "cash",
	"credit" = "credit",
}
export type InvoicesRecord<Titems = unknown> = {
	created?: IsoDateString
	customer: RecordIdString
	date: IsoDateString
	id: string
	invoice_number: string
	items: null | Titems
	notes?: string
	payment_method: string
	payment_status: string
	subtotal: number
	tax: number
	total: number
	updated?: IsoDateString
	expand?: {customer?: CustomersRecord}
}

export type UsersRecord = {
	avatar?: string
	created?: IsoDateString
	email: string
	emailVisibility?: boolean
	id: string
	name?: string
	password: string
	tokenKey: string
	updated?: IsoDateString
	verified?: boolean
}

export type VendorsRecord = {
	created?: IsoDateString
	id: string
	name?: string
	updated?: IsoDateString
}

// Response types include system fields and match responses from the PocketBase API
export type AuthoriginsResponse<Texpand = unknown> = Required<AuthoriginsRecord> & BaseSystemFields<Texpand>
export type ExternalauthsResponse<Texpand = unknown> = Required<ExternalauthsRecord> & BaseSystemFields<Texpand>
export type MfasResponse<Texpand = unknown> = Required<MfasRecord> & BaseSystemFields<Texpand>
export type OtpsResponse<Texpand = unknown> = Required<OtpsRecord> & BaseSystemFields<Texpand>
export type SuperusersResponse<Texpand = unknown> = Required<SuperusersRecord> & AuthSystemFields<Texpand>
export type CustomersResponse<Texpand = unknown> = Required<CustomersRecord> & BaseSystemFields<Texpand>
export type EmployeesResponse<Texpand = unknown> = Required<EmployeesRecord> & BaseSystemFields<Texpand>
export type InventoryResponse<Texpand = unknown> = Required<InventoryRecord> & BaseSystemFields<Texpand>
export type InvoicesResponse<Titems = unknown, Texpand = unknown> = Required<InvoicesRecord<Titems>> & BaseSystemFields<Texpand>
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> & AuthSystemFields<Texpand>
export type VendorsResponse<Texpand = unknown> = Required<VendorsRecord> & BaseSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	_authOrigins: AuthoriginsRecord
	_externalAuths: ExternalauthsRecord
	_mfas: MfasRecord
	_otps: OtpsRecord
	_superusers: SuperusersRecord
	customers: CustomersRecord
	employees: EmployeesRecord
	inventory: InventoryRecord
	invoices: InvoicesRecord
	users: UsersRecord
	vendors: VendorsRecord
}

export type CollectionResponses = {
	_authOrigins: AuthoriginsResponse
	_externalAuths: ExternalauthsResponse
	_mfas: MfasResponse
	_otps: OtpsResponse
	_superusers: SuperusersResponse
	customers: CustomersResponse
	employees: EmployeesResponse
	inventory: InventoryResponse
	invoices: InvoicesResponse
	users: UsersResponse
	vendors: VendorsResponse
}

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = PocketBase & {
	collection(idOrName: '_authOrigins'): RecordService<AuthoriginsResponse>
	collection(idOrName: '_externalAuths'): RecordService<ExternalauthsResponse>
	collection(idOrName: '_mfas'): RecordService<MfasResponse>
	collection(idOrName: '_otps'): RecordService<OtpsResponse>
	collection(idOrName: '_superusers'): RecordService<SuperusersResponse>
	collection(idOrName: 'customers'): RecordService<CustomersResponse>
	collection(idOrName: 'employees'): RecordService<EmployeesResponse>
	collection(idOrName: 'inventory'): RecordService<InventoryResponse>
	collection(idOrName: 'invoices'): RecordService<InvoicesResponse>
	collection(idOrName: 'users'): RecordService<UsersResponse>
	collection(idOrName: 'vendors'): RecordService<VendorsResponse>
}
