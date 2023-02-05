/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */

var jpdbBaseURL = 'http://api.login2explore.com:5577';
var jpdbIRL = '/api/irl';
var jpdbIML = '/api/iml';
var stdDBName = 'Student-DB';
var stdRelationName = 'StudentData';
var connToken = "90932694|-31949276774534432|90954596";

$('rollno').focus();


//record number is stored at local storage
//record number is specifically used in update command
function saveRecNo2LS(jsonObj){
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem('recno',lvData.rec_no);
}

function getStdIdAsJsonObj()
{
    var rollno = $('#rollno').val();
    var jsonStr={
        id:rollno
    };
    return JSON.stringify(jsonStr);
}

function fillData(jsonObj)
{
    saveRecNo2LS(jsonObj);
    var record = JSON.parse(jsonObj.data).record;
    $('#name').val(record.name);
    $("#sclass").val(record.sclass);
    $("#bdate").val(record.bdate);
    $("#add").val(record.add);
    $("#endate").val(record.endate);
}

function resetForm()
{
    $('#rollno').val("");
    $('#name').val("");
    $('#sclass').val("");
    $('#bdate').val("");
    $('#add').val("");
    $('#endate').val("");
    $('#rollno').prop("disabled",false);
    $('#save').prop("disabled",true);
    $('#change').prop("disabled",true);
    $('#reset').prop("disabled",true);
    $('#rollno').focus();
}

function validateData(){
    var rollno, name, sclass, bdate,add,endate;
    rollno=$("#rollno").val();
    name=$("#name").val();
    sclass=$("#sclass").val();
    bdate=$("bdate").val();
    add=$("#add").val();
    endate=$("#endate").val();  
    if(rollno===''){
        alert('Student roll no. is missing');
        $('#empid').focus();
        return '';
    } 
    if(name==='')
    {
        alert('Student Name missing');
        $('#name').focus();
        return "";
    }
    if(sclass==='')
    {
        alert('Student class missing');
        $('#sclass').focus();
        return "";
    }
    if(bdate==='')
    {
        alert('Birth Date is missing');
        $('#bdate').focus();
        return "";
    }
    if(add==='')
    {
        alert('Adress is missing');
        $('#add').focus();
        return "";
    }
    if(endate==='')
    {
        alert('Enrollment Date is missing');
        $('#endate').focus();
        return "";
    }
    var jsonStrObj={
        id:rollno,
        name:name,
        sclass:sclass,
        bdate:bdate,
        add:add,
        endate:endate
    };
    return JSON.stringify(jsonStrObj);
}

function getStd()
{
    var stdIdJsonObj = getStdIdAsJsonObj();
    var getRequest = createGET_BY_KEYRequest(connToken, stdDBName, stdRelationName, stdIdJsonObj);
    jQuery.ajaxSetup({asyn:false});
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);
    jQuery.ajaxSetup({async:true});
    if(resJsonObj.status===400){
        $("#save").prop('disabled',false);
        $("#reset").prop("disabled",false);
        $("name").focus();
    }
    else if(resJsonObj.status===200)
    {
        $("#rollno").prop('disabled',true);
        fillData(resJsonObj);
        $("#change").prop("disabled",false);
        $("#reset").prop("disabled",false);
        $("#name").focus();
    }
}

function saveData()
{
    var jsonStrObj = validateData();
    if(jsonStrObj === '')
    {
        return '';
    } 
    var putRequest = createPUTRequest(connToken, jsonStrObj, stdDBName, stdRelationName);
    jQuery.ajaxSetup({async:false});
    var resJsonObj = executeCommandAtGivenBaseUrl(putRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({async:true});
    resetForm();
    $('#empid').focus();
}


function changeData()
{
    $('#change').prop('disabled',true);
    jsonChg = validateData();
    var updateRequest = createUPDATERecordRequest(connToken, jsonChg, stdDBName, stdRelationName, localStorage.getItem("recno"));
    jQuery.ajaxSetup({async:false});
    var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({async:true});
    console.log(resJsonObj);
    resetForm();
    $('#rollno').focus();  
}
