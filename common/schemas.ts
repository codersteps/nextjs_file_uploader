export interface StandardContract {
	// Name of the vendor who sells the item
 supplier: string;
 // Quote or order number, empty if there is no matching information
 orderId: string;
 // When the order is placed
 orderDate: string;
 // List of addresses of the customer
 customerAddresses: string[];
 // Country of the customer
 country: string;
 // Item groups
 itemGroups: {
	 name: string; // Name of the item group
	 items: {
		 name: string; // Name of the item
		 quantity: string; // Quantity of the item
		 unitPrice: string; // Unit price of the item
		 contractTerm: string; // Length of the contract for the item in months
		 monthlyCharge: string; // Monthly payment for the item
	 }[],
	 subtotal: string; // Subtotal amount of the item group
	 tax: string; // Tax amount of the item group
	 total: string; // Total amount of the item group
 }[],
 total: string; // Total value of the entire contract, including all item groups
 ActivationDate: string; // Contract start date
 EndDate: string; // Contract end date
 BillingStartDate: string; // Date when billing starts
 BillingEndDate: string; // Date when billing ends
 RenewalNoticeDays: string; // Days in advance to give renewal notice
 AutoRenew: boolean; // If the contract can be auto-renewed
}