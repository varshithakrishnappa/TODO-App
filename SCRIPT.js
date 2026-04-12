$(document).ready(function(){

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    function save() {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function render() {
        $("#taskList").empty();

        if(tasks.length === 0){
            $("#emptyState").show();
        } else {
            $("#emptyState").hide();
        }

        tasks.forEach((t, i) => {
            $("#taskList").append(`
                <li class="task">
                    <div class="left">
                        <input type="checkbox" ${t.done ? "checked":""} data-i="${i}" class="check">
                        <span class="task-text ${t.done?"completed":""}">
                            ${t.text} 
                            <small class="text-muted">${t.date || ""}</small>
                        </span>
                    </div>
                    <div class="icons">
                        <i class="bi bi-pencil edit" data-i="${i}"></i>
                        <i class="bi bi-trash delete" data-i="${i}"></i>
                    </div>
                </li>
            `);
        });

        updateStats();
    }

    function updateStats(){
        let total = tasks.length;
        let completed = tasks.filter(t=>t.done).length;

        $("#total").text("Total: "+total);
        $("#completed").text("Done: "+completed);
        $("#pending").text("Pending: "+(total-completed));
    }

    function addTask(){
        let text = $("#taskInput").val().trim();
        let date = $("#dueDate").val();

        if(text===""){
            $("#errorMsg").text("Enter task!");
            return;
        }

        tasks.push({text, date, done:false});
        save(); render();

        $("#taskInput").val("");
        $("#dueDate").val("");
        $("#errorMsg").text("");
    }

    $("#addTask").click(addTask);
    $("#taskInput").keypress(e => e.which===13 && addTask());

    $("#taskList").on("change",".check",function(){
        let i=$(this).data("i");
        tasks[i].done=!tasks[i].done;
        save(); render();
    });

    $("#taskList").on("click",".delete",function(){
        tasks.splice($(this).data("i"),1);
        save(); render();
    });

    $("#taskList").on("click",".edit",function(){
        let i=$(this).data("i");
        let t=prompt("Edit:",tasks[i].text);
        if(t) tasks[i].text=t;
        save(); render();
    });

    $("#searchTask").on("input",function(){
        let v=$(this).val().toLowerCase();
        $(".task").toggle(function(){
            return $(this).text().toLowerCase().includes(v);
        });
    });

    $("#clearAll").click(()=>{
        if(confirm("Clear all?")){
            tasks=[]; save(); render();
        }
    });

    $("#toggleDark").click(()=>{
        $("body").toggleClass("dark");
    });

    // Drag & Drop
    new Sortable(document.getElementById("taskList"), {
        animation: 150,
        onEnd: function (evt) {
            let moved = tasks.splice(evt.oldIndex, 1)[0];
            tasks.splice(evt.newIndex, 0, moved);
            save();
        }
    });

    render();

});