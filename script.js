// No seu script.js, atualiza a função renderTable()

// Renderizar tabela
renderTable() {
    const tableBody = document.getElementById('tableBody');
    
    if (this.students.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; color: #718096; padding: 40px;">
                    <i class="fas fa-users" style="font-size: 3rem; color: #cbd5e0; margin-bottom: 10px; display: block;"></i>
                    Nenhum aluno cadastrado. <br>Adicione o primeiro aluno usando o formulário acima.
                </td>
            </tr>
        `;
        return;
    }

    tableBody.innerHTML = this.students.map(student => `
        <tr>
            <td>${student.name}</td>
            <td>${student.grade1}</td>
            <td>${student.grade2}</td>
            <td>${student.grade3}</td>
            <td><strong>${student.average}</strong></td>
            <td>
                <span class="status-${student.status === 'Aprovado' ? 'approved' : 'failed'}">
                    ${student.status === 'Aprovado' ? 
                      '<i class="fas fa-check-circle"></i> Aprovado' : 
                      '<i class="fas fa-times-circle"></i> Reprovado'}
                </span>
            </td>
            <td>
                <button class="btn-remove" onclick="gradeSystem.removeStudent(${student.id})" title="Remover aluno">
                    <i class="fas fa-trash-alt"></i> Remover
                </button>
            </td>
        </tr>
    `).join('');
}