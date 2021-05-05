defmodule DragnCardsWeb.API.V1.RegistrationController do
  use DragnCardsWeb, :controller

  alias Ecto.Changeset
  alias Plug.Conn
  alias DragnCardsWeb.ErrorHelpers

  @spec create(Conn.t(), map()) :: Conn.t()
  def create(conn, %{"user" => user_params}) do
    conn
    |> Pow.Plug.create_user(user_params)
    |> case do
      {:ok, user, conn} ->
        send_confirmation_email(user, conn)

        json(conn, %{
          data: %{
            token: conn.private[:api_auth_token],
            renew_token: conn.private[:api_renew_token]
          }
        })

      {:error, changeset, conn} ->
        errors = Changeset.traverse_errors(changeset, &ErrorHelpers.translate_error/1)

        conn
        |> put_status(500)
        |> json(%{error: %{status: 500, message: "Couldn't create user", errors: errors}})
    end
  end

  _ = """
  *** Next two functions are copied and modified from
  ./lib/extensions/email_confirmation/phoenix/controllers/controller_callbacks.ex
  in the 'pow' library.
  REASON: Customize the url sent to include the front-end. ***
  """

  @doc """
  Sends a confirmation e-mail to the user.

  The user struct passed to the mailer will have the `:email` set to the
  `:unconfirmed_email` value if `:unconfirmed_email` is set.
  """
  @spec send_confirmation_email(map(), Conn.t()) :: any()
  def send_confirmation_email(user, conn) do
    IO.puts("send confirm")
    IO.inspect(user)
    IO.inspect(conn)
    url = confirmation_url(conn, user)
    IO.puts("url")
    IO.inspect(url)
    unconfirmed_user = %{user | email: user.unconfirmed_email || user.email}
    IO.puts("unconfirmed_user")
    IO.inspect(unconfirmed_user)
    email = PowEmailConfirmation.Phoenix.Mailer.email_confirmation(conn, unconfirmed_user, url)
    IO.puts("email")
    IO.inspect(email)
    a = Pow.Phoenix.Mailer.deliver(conn, email)
    IO.puts("deliver")
    IO.inspect(a)
  end

  defp confirmation_url(conn, user) do
    token = PowEmailConfirmation.Plug.sign_confirmation_token(conn, user)
    IO.puts("token")
    IO.inspect(token)
    a = Application.get_env(:dragncards, DragnCardsWeb.Endpoint)[:front_end_email_confirm_url]
    |> String.replace("{token}", token)
    IO.puts("env")
    IO.inspect(a)
    a
  end
end