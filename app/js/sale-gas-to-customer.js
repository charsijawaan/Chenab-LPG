 showSaleGasToCustomerDiv = () => {
    hideAllDivs()
    $(`#sale-gas-to-customer-div`).html('')
    
    getAllTypesOfCylinders((err, cylinderTypes)=> {
        getAllPlants((err, allPlants)=>{
            $(`#sale-gas-to-customer-div`).append(`
                <div style="text-align: center;">
                    <h2>Sale Gas</h2>
                </div>
                <div>
                    <div style="text-align: center;">
                        <div class="mt-2">
                            <label for="inp" class="inp">
                            <input type="text" placeholder="&nbsp;" required id="customer-name-field-sale-gas" onkeydown="getCustomersFromDatabase()">
                            <span class="label">Enter Customer Name</span>
                            <span class="focus-bg"></span>
                            </label>                
                        </div>
                    </div>
                <div style="text-align: center;display: flex; flex-direction: column;" id="select-customer-div-wrapper">
                    <!-- html changes here while searching
                </div>
            </div>
            `)

            // select plant portion starts here
            let str = ''
            str += `
                <center>
                    <select name="plant" id="select-plant-sale-gas-to-customer-div" onchange="updateSaleGasToCustomerGUI()">`
            for(let i = 0; i < allPlants.length; i++) {
                str += `<option value="${allPlants[i].plant_id}">${allPlants[i].plant_name}</option>`                
            }
            str += `</select>
                </center>`
            $(`#sale-gas-to-customer-div`).append(str)


            $(`#sale-gas-to-customer-div`).append(`
                <div id="sale-gas-by-plant"></div>
            `)

            updateSaleGasToCustomerGUI()
            
            $('#sale-gas-to-customer-div').append(`
                <center>
                    <div>
                        <button class="btn btn-primary mt-3" id="sale-gas-to-customer-btn" 
                        onclick="saleGasToCustomer()" style="width: 100px; text-align: center;">Sale</button>
                    </div>
                    <div class="mt-4">
                        <h2 id="sale-gas-total">Total = 0</h2>
                    </div>
                    <div class="mt-3">
                        <h2 id="sale-gas-profit">Profit = 0</h2>
                    </div>
                </center>
            `)
        })
        
    })
    $('#sale-gas-to-customer-div').css('display', 'flex')
 }


 updateSaleGasToCustomerGUI = () => {
    $(`#sale-gas-by-plant`).html('')
    let plantID = $(`#select-plant-sale-gas-to-customer-div`).find(':selected').val()

    getAllTypesOfCylinders((err, cylinderTypes)=>{
        for(let i = 0; i < cylinderTypes.length; i++) {
            getAvailableStockByPlantID(cylinderTypes[i].weight, plantID, (err, availStock)=>{
                $(`#sale-gas-by-plant`).append(`
                <div style="display: flex;justify-content: center">
                <div style="text-align: center;" style="display: flex;">
                    <div class="mt-4" style="display: flex;align-items: center;">

                        <!-- enable/disable checkbox -->
                        <ul style="margin: 8px 0px;">
                            <li>
                            <input id="${cylinderTypes[i].weight}kg-sale-gas-checkbox" type="checkbox" 
                            class="switch" onchange="handleSaleGasCheckBoxes(${cylinderTypes[i].weight})">
                            <label for="s1">${cylinderTypes[i].weight} Kg</label>
                            </li>
                        </ul>

                        <!-- select which cylinder to sale -->
                        <select id="${cylinderTypes[i].weight}kg-available-gas-rates" onchange="calculateTotalAndProfit()"></select>
                        <span class="mr-4" style="width: 150px">${cylinderTypes[i].weight} Kg</span>

                        <!-- enter sale gas rate input -->
                        <label for="inp" class="inp mr-3">
                        <input type="number" placeholder="&nbsp;" oninput="validity.valid||(value='');calculateTotalAndProfit();" min="1"
                        required id="sale-gas-${cylinderTypes[i].weight}kg-gas-rate" disabled>
                        <span class="label">Enter Sale Rate</span>
                        <span class="focus-bg"></span>
                        </label>
            
                        <!-- enter number of cylinders input -->
                        <label for="inp" class="inp mr-3">
                        <input type="number" placeholder="&nbsp;" oninput="validity.valid||(value='');calculateTotalAndProfit();" min="1" 
                        required id="sale-gas-${cylinderTypes[i].weight}kg-cylinders" disabled>
                        <span class="label">Number of Cylinders</span>
                        <span class="focus-bg"></span>
                        </label>
                    </div>
                                                           
                </div>
            </div>       
                `)

                getAvailableStockByPlantID(cylinderTypes[i].weight, plantID, (err, availStock)=>{
                    for(let j = 0; j < availStock.length; j++) {
                        $(`#${cylinderTypes[i].weight}kg-available-gas-rates`).append(`
                            <option>${availStock[j].buy_rate}</option>  
                        `)
                    }                          
                })
            })
        }
    })
 }

 getCustomersFromDatabase = () => {
    $(`#select-customer-div-wrapper`).html('')
    let name = $('#customer-name-field-sale-gas').val()
    getCustomersByName(name, (err, names)=>{
        for(let i = 0; i < names.length; i++) {
            $(`#select-customer-div-wrapper`).append(`
            <div style="color: #000; background-color: #fff;border: 3px solid black;">
                <span data-id="${names[i].customer_id}" data-name="${names[i].customer_name}" 
                style="cursor: pointer;" onclick="selectCustomer(this)">${names[i].customer_name}</span>
            </div>                
            `)
        }
    })
 }


 selectCustomer = (customerSpan) => {
     let customerID = $(customerSpan).attr('data-id')
     let customerName = $(customerSpan).attr('data-name')
     $('#customer-name-field-sale-gas').val(customerName)
     $(`#select-customer-div-wrapper`).html('')
 }


 handleSaleGasCheckBoxes = (weight) => {
    calculateTotalAndProfit()
    if($(`#${weight}kg-sale-gas-checkbox`).prop('checked')) {
        $(`#sale-gas-${weight}kg-cylinders`).prop('disabled', false)
        $(`#sale-gas-${weight}kg-gas-rate`).prop('disabled', false)
    }
    else {
        $(`#sale-gas-${weight}kg-cylinders`).prop('disabled', true)
        $(`#sale-gas-${weight}kg-gas-rate`).prop('disabled', true)
        $(`#sale-gas-${weight}kg-cylinders`).val('')
        $(`#sale-gas-${weight}kg-gas-rate`).val('')
    }
 }

 calculateTotalAndProfit = () => {
    getAllTypesOfCylinders((err, cylinderTypes)=>{
        let total = 0
        let profit = 0
        let costPrice = 0
        for(let i = 0; i < cylinderTypes.length; i++) {
            if(!($(`#${cylinderTypes[i].weight}kg-sale-gas-checkbox`).prop('checked')))
                continue
            total += Number($(`#sale-gas-${cylinderTypes[i].weight}kg-gas-rate`).val())  * Number($(`#sale-gas-${cylinderTypes[i].weight}kg-cylinders`).val())
            costPrice += Number($(`#${cylinderTypes[i].weight}kg-available-gas-rates`).find(":selected").text()) * Number($(`#sale-gas-${cylinderTypes[i].weight}kg-cylinders`).val())
        }
        profit = total - costPrice
        $(`#sale-gas-total`).html(`
            Total = ${total} Rs/-
        `)
        $(`#sale-gas-profit`).html(`
            Profit = ${profit} Rs/-
        `)
    })
 }

 saleGasToCustomer = () => {
    let customerName = $('#customer-name-field-sale-gas').val()
    let total = 0
    let profit = 0
    if(customerName === '') {
        let options = {
            type: 'info',
            buttons: ['Okay'],
            message: `Enter customer name first`,
            normalizeAccessKeys: true
        }
        dialog.showMessageBox(options, i => {
            if (i == 0) {
                return
            }
        })
        return
    }
    getCustomer(customerName, (err, customerData)=>{
        if(customerData.length < 1) {
            let options = {
                type: 'info',
                buttons: ['Okay'],
                message: `No customer with this name was found`,
                normalizeAccessKeys: true
            }
            dialog.showMessageBox(options, i => {
                if (i == 0) {
                    return
                }
            })
        }
        else {
            getAllTypesOfCylinders((err, cylinderTypes)=>{
                let total = 0
                let profit = 0
                let costPrice = 0
                for(let i = 0; i < cylinderTypes.length; i++) {
                    if(!($(`#${cylinderTypes[i].weight}kg-sale-gas-checkbox`).prop('checked')))
                        continue
                    total += Number($(`#sale-gas-${cylinderTypes[i].weight}kg-gas-rate`).val())  * Number($(`#sale-gas-${cylinderTypes[i].weight}kg-cylinders`).val())
                    costPrice += Number($(`#${cylinderTypes[i].weight}kg-available-gas-rates`).find(":selected").text()) * Number($(`#sale-gas-${cylinderTypes[i].weight}kg-cylinders`).val())
                }
                let date = new Date()
                profit = total - costPrice
                let plantID = $('#select-plant-sale-gas-to-customer-div').children('option:selected').val()
                insertIntoSales(customerData[0].customer_id, date.getTime(), total, profit, costPrice, plantID, (err)=>{
                    getLastSalesID((err, lastRow)=>{
                        for(let i = 0; i < cylinderTypes.length; i++) {
                            if(!($(`#${cylinderTypes[i].weight}kg-sale-gas-checkbox`).prop('checked')))
                                continue
                                let numberOfCylinders =  Number($(`#sale-gas-${cylinderTypes[i].weight}kg-cylinders`).val())
                                let subTotal = Number($(`#sale-gas-${cylinderTypes[i].weight}kg-gas-rate`).val())  * Number($(`#sale-gas-${cylinderTypes[i].weight}kg-cylinders`).val())
                                let subCost = Number($(`#${cylinderTypes[i].weight}kg-available-gas-rates`).find(":selected").text()) * Number($(`#sale-gas-${cylinderTypes[i].weight}kg-cylinders`).val())
                                let subProfit = subTotal - subCost
                                insertIntoSalesDetails(lastRow.sales_id, cylinderTypes[i].weight, numberOfCylinders, subTotal, subCost, subProfit, plantID, (err)=>{
                                    let options = {
                                        type: 'info',
                                        buttons: ['Okay'],
                                        message: `Cylinder sold to customer`,
                                        normalizeAccessKeys: true
                                    }
                                    dialog.showMessageBox(options, i => {
                                        if (i == 0) {
                                            return
                                        }
                                    })
                                    resetSaleGasDiv()
                                    updateMainWindowGUI()                                    
                                })
                        }
                    })
                    
                })
            })
        }
    })
 }

 resetSaleGasDiv = () => {
    $(`#sale-gas-to-customer-div`).html('')
 }