using System;
using System.Collections.Generic;
using CreditNoVa_API.Models;
using Microsoft.EntityFrameworkCore;

namespace CreditNoVa_API.WebApp.Models;

public partial class CreditNovaContext : DbContext
{
    public CreditNovaContext()
    {
    }

    public CreditNovaContext(DbContextOptions<CreditNovaContext> options)
        : base(options)
    {
    }

    public virtual DbSet<CreditSurvey> CreditSurveys { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Server=localhost,1433;Database=CreditNova;User=sa;Password=YourStrong!Passw0rd;MultipleActiveResultSets=true;TrustServerCertificate=True");

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
