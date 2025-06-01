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
	Admins = "admins",
	Inventory = "inventory",
	Invoices = "invoices",
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

export enum AdminsRoleOptions {
	"manager" = "manager",
	"sales" = "sales",
}
export type AdminsRecord = {
	avatar?: string
	created?: IsoDateString
	email: string
	emailVisibility?: boolean
	id: string
	name?: string
	password: string
	role?: AdminsRoleOptions
	tokenKey: string
	updated?: IsoDateString
	verified?: boolean
}

export enum InventoryItemTypeOptions {
	"Ring" = "Ring",
	"Bracelet" = "Bracelet",
	"Necklace" = "Necklace",
	"Earrings" = "Earrings",
	"Pendant" = "Pendant",
	"Chain" = "Chain",
	"Bangle" = "Bangle",
	"Crown" = "Crown",
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
	id: string
	item_id: string
	item_name: string
	item_type: InventoryItemTypeOptions
	karat: InventoryKaratOptions
	quantity?: number
	cost_price?: number
	selling_price?: number
	updated?: IsoDateString
	vendor_address?: string
	vendor_contact_person?: string
	vendor_name?: string
	vendor_phone?: string
	weight: number
	created?: IsoDateString
}

export enum InvoicesTypeOptions {
	"cash" = "cash",
	"credit" = "credit",
}
export type InvoicesRecord<Titems = unknown> = {
	No?: string
	created?: IsoDateString
	customer_name?: string
	customer_phone?: string
	id: string
	items: null | Titems
	making_charges?: number
	subtotal?: number
	total_amount?: number
	type?: InvoicesTypeOptions
	updated?: IsoDateString
}

// Response types include system fields and match responses from the PocketBase API
export type AuthoriginsResponse<Texpand = unknown> = Required<AuthoriginsRecord> & BaseSystemFields<Texpand>
export type ExternalauthsResponse<Texpand = unknown> = Required<ExternalauthsRecord> & BaseSystemFields<Texpand>
export type MfasResponse<Texpand = unknown> = Required<MfasRecord> & BaseSystemFields<Texpand>
export type OtpsResponse<Texpand = unknown> = Required<OtpsRecord> & BaseSystemFields<Texpand>
export type SuperusersResponse<Texpand = unknown> = Required<SuperusersRecord> & AuthSystemFields<Texpand>
export type AdminsResponse<Texpand = unknown> = Required<AdminsRecord> & AuthSystemFields<Texpand>
export type InventoryResponse<Texpand = unknown> = Required<InventoryRecord> & BaseSystemFields<Texpand>
export type InvoicesResponse<Titems = unknown, Texpand = unknown> = Required<InvoicesRecord<Titems>> & BaseSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	_authOrigins: AuthoriginsRecord
	_externalAuths: ExternalauthsRecord
	_mfas: MfasRecord
	_otps: OtpsRecord
	_superusers: SuperusersRecord
	admins: AdminsRecord
	inventory: InventoryRecord
	invoices: InvoicesRecord
}

export type CollectionResponses = {
	_authOrigins: AuthoriginsResponse
	_externalAuths: ExternalauthsResponse
	_mfas: MfasResponse
	_otps: OtpsResponse
	_superusers: SuperusersResponse
	admins: AdminsResponse
	inventory: InventoryResponse
	invoices: InvoicesResponse
}

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = PocketBase & {
	collection(idOrName: '_authOrigins'): RecordService<AuthoriginsResponse>
	collection(idOrName: '_externalAuths'): RecordService<ExternalauthsResponse>
	collection(idOrName: '_mfas'): RecordService<MfasResponse>
	collection(idOrName: '_otps'): RecordService<OtpsResponse>
	collection(idOrName: '_superusers'): RecordService<SuperusersResponse>
	collection(idOrName: 'admins'): RecordService<AdminsResponse>
	collection(idOrName: 'inventory'): RecordService<InventoryResponse>
	collection(idOrName: 'invoices'): RecordService<InvoicesResponse>
}
